import { makeAutoObservable, runInAction } from 'mobx'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { OracleStreamId, WestDecimals } from '../constants'
import { IVault } from '../interfaces'
import ConfigStore from './ConfigStore'
import { roundNumber, cutNumber } from '../utils'

export interface IDataPoint {
  value: number;
  timestamp: number;
  height: number;
}

const emptyUserVault: IVault = {
  id: 0,
  address: '',
  createdAt: '',
  eastAmount: '',
  rwaAmount: '',
  rwaRate: '',
  rwaRateTimestamp: '',
  vaultId: '',
  westAmount: '',
  westRate: '',
  westRateTimestamp: ''
}

export default class DataStore {
  api
  configStore
  pollingId: any = null
  vault: IVault = {...emptyUserVault}
  westBalance = '0.0'
  eastBalance = '0.0'
  westRate = '0'
  usdapRate = '0'
  westPriceHistory: IDataPoint[] = []

  constructor(api: Api, configStore: ConfigStore) {
    makeAutoObservable(this)
    this.api = api
    this.configStore = configStore
  }

  // Calculated expected fully supplied (==250%) vault west amount
  get expectedVaultWestAmount () {
    const westPart = 1 - this.configStore.getUsdpPart()
    const westCollateral = this.configStore.getWestCollateral()
    const expectedWestAmount = (+this.vault.eastAmount * westPart * +this.usdapRate * westCollateral) / +this.westRate
    return  roundNumber(expectedWestAmount, 8)
  }

  // Vault collateral percentage: converted from "expectedVaultWestAmount"
  get vaultCollateral () {
    const westPart = 1 - this.configStore.getUsdpPart()
    // const currentWestCollateral = (+this.vault.westAmount * +this.westRate) / (westPart * +this.vault.eastAmount)
    // return Math.ceil(currentWestCollateral * 100) / 100
    const currentVaultCollateral = (+this.vault.westAmount * +this.westRate) / (+this.vault.eastAmount * westPart * +this.usdapRate)
    return roundNumber(currentVaultCollateral, 2)
  }

  // How many west need to supply vault to 250%
  // If value < 0, vault is over-supplied and contains free west
  get supplyVaultWestDiff () {
    const diff = roundNumber(this.expectedVaultWestAmount - +this.vault.westAmount, 7)
    if (Math.abs(diff) > 0.1) {
      return diff
    }
    return 0
  }

  get vaultEastProfit () {
    const westAmount = -this.supplyVaultWestDiff
    const data = this.calculateEastAmount({ westAmount })
    return data
  }

  get vaultEastAmount () {
    return this.vault.eastAmount || '0'
  }

  get transferedEastAmount () {
    return (+this.eastBalance - +this.vaultEastAmount).toString() || '0'
  }

  sleep(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  async getTokenRates () {
    const [{ value: westRate }] = await this.api.getOracleValues(OracleStreamId.WestRate, 1)
    const [{ value: usdapRate }] = await this.api.getOracleValues(OracleStreamId.UsdapRate, 1)
    return {
      westRate,
      usdapRate
    }
  }

  async startPolling (address: string) {
    const updateTokenRates = async () => {
      const { westRate, usdapRate } = await this.getTokenRates()
      runInAction(() => {
        this.westRate = westRate
        this.usdapRate = usdapRate
      })
    }

    const updateUserVault = async () => {
      const vault = await this.api.getVault(address)
      // console.log('User Vault:', vault)
      if (vault) {
        runInAction(() => {
          this.vault = vault
        })
      }
    }

    const updateEastTotalBalance = async () => {
      const balance = await this.getEastBalance(address)
      runInAction(() => {
        this.eastBalance = balance
      })
    }

    const updateWestBalance = async () => {
      const westBalance = await this.getWestBalance(address)
      runInAction(() => {
        this.westBalance = roundNumber(westBalance, 8).toString()
      })
    }

    const updateData = async () => {
      try {
        await updateUserVault()
        await updateEastTotalBalance()
        await updateWestBalance()
        await updateTokenRates()
      } catch(e) {
        console.error(`Cannot get data for "${address}":`, e.message)
      }
    }
    clearInterval(this.pollingId)
    await updateData()
    console.log('Start polling user data')
    this.pollingId = setInterval(updateData, 5 * 1000)
  }

  stopPolling () {
    console.log('Stop polling user data')
    clearInterval(this.pollingId)
  }

  logout () {
    this.stopPolling()
    runInAction(() => {
      this.vault = {...emptyUserVault}
    })
  }

  async getEastBalance(address: string): Promise<string> {
    const { eastAmount } = await this.api.getUserEastBalance(address)
    return cutNumber(eastAmount, 8) || '0'
  }

  async getWestBalance(address: string): Promise<string> {
    const { balance } = await this.api.getAddressBalance(address)
    return new BigNumber(balance).dividedBy(Math.pow(10, WestDecimals)).toString()
  }

  calculateWestAmount (eastAmount: string | number) {
    const usdpPart = this.configStore.getUsdpPart()
    const westCollateral = this.configStore.getWestCollateral()
    const westRate = +this.westRate

    return +eastAmount * ((usdpPart / westRate) + ((1 - usdpPart) / westRate * westCollateral))
  }

  calculateEastAmount (data: { westAmount: string | number }) {
    const { westAmount } = data
    const usdpPart = this.configStore.getUsdpPart()
    const westCollateral = this.configStore.getWestCollateral()
    const westRate = +this.westRate
    const usdapRate = +this.usdapRate

    const usdpPartInPosition = usdpPart / ((1 - usdpPart) * westCollateral + usdpPart)
    const westToUsdpAmount = usdpPartInPosition * +westAmount
    const eastAmount = (westToUsdpAmount * westRate) / usdpPart
    const usdpAmount = westToUsdpAmount * westRate / usdapRate
    return {
      eastAmount: roundNumber(eastAmount, 8),
      usdpAmount: roundNumber(usdpAmount, 8)
    }
  }
}
