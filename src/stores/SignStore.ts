import { makeAutoObservable } from 'mobx'
import { create, MAINNET_CONFIG, Seed, WeSdk } from '@wavesenterprise/js-sdk'
import ConfigStore from './ConfigStore'
import AuthStore from './AuthStore'
import { ICallContractTx, ITransferTx, TxTextType } from '../interfaces'
import { Api } from '../api'

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
  weSDK: WeSdk
  api: Api
  signStrategy: SignStrategy = SignStrategy.WeWallet
  currentSeed: Seed | null = null

  constructor(api: Api,configStore: ConfigStore, authStore: AuthStore) {
    this.api = api
    this.configStore = configStore
    this.authStore = authStore
    this.weSDK = this.createWeSDK()
    makeAutoObservable(this)
  }

  initStore(email: string): void {
    const account = this.getLSAccount(email)
    if (account) {
      this.setSignStrategy(account[LSAccountProps.SignStrategy])
    }
  }

  createWeSDK (): WeSdk {
    const config = {
      ...MAINNET_CONFIG,
      nodeAddress: '/nodeAddress',
      crypto: 'waves',
      networkByte: this.configStore.nodeConfig.chainId.charCodeAt(0),
      minimumFee: {...this.configStore.nodeConfig.minimumFee}
    }

    const weSDKInstance = create({
      initialConfiguration: config,
      fetchInstance: window.fetch
    })
    return weSDKInstance
  }

  initWeSDK (): void {
    this.weSDK = this.createWeSDK()
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

  sendTxWatch (txId: string, address: string, type: string) {
    return this.api.sendTransactionBroadcast(txId, address, type)
  }

  async broadcastAtomic (txs: Array<{ type: TxTextType, tx: any }>) {
    // const dockerCallTxs = txs.filter(tx => tx.type === TxTextType.dockerCallV4)
    // if (dockerCallTxs.length > 0) {
    //   await Promise.all(dockerCallTxs.map(async dockerCallTx => {
    //     const txId = await this.getDockerCallId(dockerCallTx.tx)
    //     const type = dockerCallTx.tx.params[0].key
    //     await this.sendTxWatch(txId, this.authStore.address, type)
    //   }))
    // }

    if (this.signStrategy === SignStrategy.WeWallet) {
      const atomicFee = this.configStore.getAtomicFee()
      return window.WEWallet.broadcastAtomic(txs, atomicFee)
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
      return this.weSDK.API.Transactions.broadcastAtomic(
        this.weSDK.API.Transactions.Atomic.V1({ transactions }),
        this.currentSeed.keyPair
      )
    } else {
      throw Error('No current seed provided')
    }
  }

  broadcastDockerCall (dockerCallBody: ICallContractTx): Promise<any> {
    if (this.signStrategy === SignStrategy.WeWallet) {
      return window.WEWallet.broadcast('dockerCallV3', dockerCallBody)
    } else if(this.currentSeed) {
      const tx = this.weSDK.API.Transactions.CallContract.V4(dockerCallBody)
      return tx.broadcast(this.currentSeed.keyPair)
    } else {
      throw new Error('No current seed provided')
    }
  }
}
