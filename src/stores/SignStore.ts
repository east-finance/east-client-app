import { makeAutoObservable } from 'mobx'
import { create, MAINNET_CONFIG, Seed, WeSdk } from '@wavesenterprise/js-sdk'
import ConfigStore from './ConfigStore'
import AuthStore from './AuthStore'
import { EastOpType, IBroadcastCallTx, ICallContractTx, ITransferTx, TxTextType, TxTypeNumber } from '../interfaces'
import { Api } from '../api'
import DataStore from './DataStore'

export enum LSKeys {
  userAccounts = 'user_accounts'
}

export enum LSAccountProps {
  SignStrategy = 'signStrategy',
  EncryptedSeed = 'encryptedSeed',
  LastSelectedAddress = 'lastSelectedAddress'
}

interface LSUserAccount {
  [LSAccountProps.SignStrategy]: SignStrategy;
  [LSAccountProps.EncryptedSeed]: string;
  [LSAccountProps.LastSelectedAddress]: string;
}

export enum SignStrategy {
  WeWallet = 'we_wallet',
  Seed = 'seed'
}

export default class SignStore {
  configStore: ConfigStore
  authStore: AuthStore
  dataStore: DataStore
  weSDK: any
  api: Api
  signStrategy: SignStrategy = SignStrategy.WeWallet
  currentSeed: Seed | null = null

  constructor(api: Api, configStore: ConfigStore, authStore: AuthStore, dataStore: DataStore) {
    this.api = api
    this.configStore = configStore
    this.authStore = authStore
    this.dataStore = dataStore
    makeAutoObservable(this)
  }

  initStore(email: string): void {
    const account = this.getLSAccount(email)
    if (account) {
      this.setSignStrategy(account[LSAccountProps.SignStrategy])
    }
  }

  initWeSDK (refresherFetch: typeof window.fetch): void {
    const config = {
      ...MAINNET_CONFIG,
      nodeAddress: '/nodeAddress',
      crypto: 'waves',
      networkByte: this.configStore.nodeConfig.chainId.charCodeAt(0),
      minimumFee: {...this.configStore.nodeConfig.minimumFee}
    }
    this.weSDK = create({
      initialConfiguration: config,
      fetchInstance: refresherFetch
    })
  }

  setSignStrategy (strategy: SignStrategy): void {
    this.signStrategy = strategy
    this.writeAccountKey(LSAccountProps.SignStrategy, strategy)
  }

  getSignStrategy(): SignStrategy {
    return this.signStrategy
  }

  getEncryptedSeed(): string {
    const account = this.getLSAccount()
    return account[LSAccountProps.EncryptedSeed] || ''
  }

  getLastSelectedAddress(): string {
    const account = this.getLSAccount()
    return account[LSAccountProps.LastSelectedAddress] || ''
  }

  getLSAccount (email = this.authStore.email): LSUserAccount {
    const accounts = JSON.parse(localStorage.getItem(LSKeys.userAccounts) || '{}')
    return accounts[email]
  }

  getAccountKeyValue (key: LSAccountProps) {
    const email = this.authStore.email
    const accounts = JSON.parse(localStorage.getItem(LSKeys.userAccounts) || '{}')
    const existedEmailData = accounts[email] ? accounts[email] : {}
    return existedEmailData[key]
  }

  writeAccountKey (key: string, value: string): void {
    const email = this.authStore.email
    let accounts = JSON.parse(localStorage.getItem(LSKeys.userAccounts) || '{}')
    const existedEmailData = accounts[email] ? accounts[email] : {}
    accounts = {
      ...accounts,
      [email]: {
        ...existedEmailData,
        [key]: value
      }
    }
    localStorage.setItem(LSKeys.userAccounts, JSON.stringify(accounts))
  }

  setSeed (seed: Seed): void {
    this.currentSeed = seed
    this.writeAccountKey(LSAccountProps.EncryptedSeed, seed.encrypt(this.authStore.password))
    this.writeAccountKey(LSAccountProps.LastSelectedAddress, seed.address)
  }

  decryptSeedPhrase(encryptedSeed: string, password: string, address: string): string {
    return this.weSDK.Seed.decryptSeedPhrase(encryptedSeed, password, address)
  }

  onChangePassword = (oldPassword: string, newPassword: string) => {
    const encryptedSeed = this.getAccountKeyValue(LSAccountProps.EncryptedSeed)
    if(encryptedSeed) {
      try {
        const phrase = this.decryptSeedPhrase(encryptedSeed, oldPassword, this.authStore.address)
        const seed = this.weSDK.Seed.fromExistingPhrase(phrase)
        this.writeAccountKey(LSAccountProps.EncryptedSeed, seed.encrypt(newPassword))
        console.log(`Encrypted address '${seed.address}' data successfully migrated to a new password`)
      } catch (e) {
        console.error('Cannot migrate encrypted seed to new password: ', e.message)
      }
    }
  }

  async getPublicData (): Promise<{ address: string, publicKey: string }> {
    if (this.signStrategy === SignStrategy.WeWallet) {
      const state = await window.WEWallet.publicState()
      // if (state.locked) {
      await window.WEWallet.auth({ data: 'EAST Client auth' })
      // }
      const { account: { address, publicKey } } = state
      return {
        address,
        publicKey
      }
    } else if(this.currentSeed) {
      return {
        address: this.currentSeed.address,
        publicKey: this.currentSeed.keyPair.publicKey
      }
    } else {
      throw Error('No current seed provided')
    }
  }

  getTransferId(tx: ITransferTx): Promise<string> {
    if (this.signStrategy === SignStrategy.WeWallet) {
      return window.WEWallet.getTxId(TxTextType.transferV3, tx)
    } else if(this.currentSeed) {
      return this.weSDK.API.Transactions.Transfer.V3(tx).getId(this.currentSeed.keyPair.publicKey)
    } else {
      throw Error('No current seed provided, cannot get transfer tx id')
    }
  }

  getDockerCallId(tx: ICallContractTx): Promise<string> {
    if (this.signStrategy === SignStrategy.WeWallet) {
      return window.WEWallet.getTxId(TxTextType.dockerCallV4, tx)
    } else if(this.currentSeed) {
      return this.weSDK.API.Transactions.CallContract.V4(tx).getId(this.currentSeed.keyPair.publicKey)
    } else {
      throw Error('No current seed provided, cannot get call tx id')
    }
  }

  startWatchDockerCallStatus (broadcastTx: IBroadcastCallTx) {
    const { id, sender, params, timestamp } = broadcastTx
    let type = ''
    if (params && params.length) {
      type = params[0].key
    }

    this.dataStore.watchTxStatus(id, type as EastOpType)

    return this.api.startWatchTxStatus(id, sender, type, timestamp)
  }

  async broadcastAtomic (txs: Array<{ type: TxTextType, tx: any }>) {
    let broadcastAtomicResult = null

    if (this.signStrategy === SignStrategy.WeWallet) {
      const atomicFee = this.configStore.getAtomicFee()
      broadcastAtomicResult = await window.WEWallet.broadcastAtomic(txs, atomicFee)
    } else if(this.currentSeed) {
      const transactions = txs.map(tx => {
        if (tx.type === TxTextType.transferV3) {
          return this.weSDK.API.Transactions.Transfer.V3(tx.tx)
        } else if (tx.type === TxTextType.dockerCallV4) {
          return this.weSDK.API.Transactions.CallContract.V4(tx.tx)
        } else {
          throw Error(`No TxTextType mapper available: ${tx.type}, cannot send atomic`)
        }
      })
      broadcastAtomicResult = await this.weSDK.API.Transactions.broadcastAtomic(
        this.weSDK.API.Transactions.Atomic.V1({ transactions }),
        this.currentSeed.keyPair
      )
    } else {
      throw Error('No current seed provided')
    }

    if (broadcastAtomicResult) {
      try {
        const dockerCallTxs = broadcastAtomicResult.transactions.filter((tx: any) => tx.type === TxTypeNumber.CallContract)
        if (dockerCallTxs.length > 0) {
          await Promise.all(dockerCallTxs.map(async (dockerCallTx: IBroadcastCallTx) => {
            await this.startWatchDockerCallStatus(dockerCallTx)
          }))
        }
      } catch (e) {
        console.error('Cannot start watch tx status:', e.message, 'Atomic tx body:', broadcastAtomicResult)
      }
    }

    return broadcastAtomicResult
  }

  async broadcastDockerCall (dockerCallBody: ICallContractTx): Promise<IBroadcastCallTx> {
    let broadcastResult = null
    if (this.signStrategy === SignStrategy.WeWallet) {
      broadcastResult = await window.WEWallet.broadcast('dockerCallV3', dockerCallBody)
    } else if(this.currentSeed) {
      const tx = this.weSDK.API.Transactions.CallContract.V4(dockerCallBody)
      broadcastResult = await tx.broadcast(this.currentSeed.keyPair)
    } else {
      throw new Error('No current seed provided')
    }

    if(broadcastResult) {
      try {
        await this.startWatchDockerCallStatus(broadcastResult)
      } catch (e) {
        console.error('Cannot start watch tx status:', e.message, 'Call tx body:', broadcastResult)
      }
    }
    return broadcastResult
  }
}
