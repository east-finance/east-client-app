import { makeAutoObservable, runInAction } from 'mobx'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { OracleStreamId, WestDecimals } from '../constants'
import { IBatch, IVault } from '../interfaces'
import ConfigStore from './ConfigStore'

enum StreamId {
  WEST_USD = '000003'
}

export interface IDataPoint {
  value: number;
  timestamp: number;
  height: number;
}

export default class DataStore {
  api
  configStore
  pollingId: any = null
  vault: IVault = {
    id: 0,
    address: '',
    createdAt: '',
    eastAmount: '',
    usdpAmount: '',
    usdpRate: '',
    usdpRateTimestamp: '',
    vaultId: '',
    westAmount: '',
    westRate: '',
    westRateTimestamp: ''
  }
  westBalance = '0.0'
  eastBalance = '0.0'
  westRate = ''
  usdapRate = ''
  westPriceHistory: IDataPoint[] = []

  constructor(api: Api, configStore: ConfigStore) {
    makeAutoObservable(this)
    this.api = api
    this.configStore = configStore
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
      this.westRate = westRate
      this.usdapRate = usdapRate
    }

    const updateUserVault = async () => {
      const vault = await this.api.getVault(address)
      this.vault = vault
      this.eastBalance = vault.eastAmount
    }

    const updateWestBalance = async () => {
      const westBalance = await this.getWestBalance(address)
      this.westBalance = westBalance
    }

    const updateData = async () => {
      try {
        await updateUserVault()
        await updateWestBalance()
        await updateTokenRates()
      } catch(e) {
        console.error(`Cannot get user (addr: "${address}") data`, e.message)
      }
    }
    clearInterval(this.pollingId)
    await updateData()
    this.pollingId = setInterval(updateData, 10 * 1000)
  }

  async getEastBalance(address: string): Promise<string> {
    const { eastAmount } = await this.api.getUserEastBalance(address)
    return eastAmount || '0'
  }

  async getWestBalance(address: string): Promise<string> {
    const { balance } = await this.api.getAddressBalance(address)
    return new BigNumber(balance).dividedBy(Math.pow(10, WestDecimals)).toString()
  }

  async getVaults (address: string): Promise<IBatch[]> {
    const vaults = await this.api.getBatches(address)
    return vaults.map(vault => {
      const westRate = this.calculateWestRate({
        usdpPart: this.configStore.getUsdpPart(),
        westCollateral: this.configStore.getWestCollateral(),
        eastAmount: +vault.eastAmount,
        westAmount: +vault.westAmount
      })
      return {
        ...vault,
        westRate: westRate.toString()
      }
    })
  }

  calculateWestAmount (data: any) {
    const { usdpPart, westCollateral, westRate, inputEastAmount } = data
    return inputEastAmount * ((usdpPart / westRate) + ((1 - usdpPart) / westRate * westCollateral))
  }

  calculateWestRate (data: any) {
    const { usdpPart, westCollateral, eastAmount, westAmount } = data
    const westRate = ((usdpPart + (1 - usdpPart) * westCollateral) * eastAmount) / westAmount
    return westRate / 1.4 // TEMPORARY FIX
  }

  calculateEastAmount (data: any) {
    const { usdpPart, westCollateral, westRate, usdapRate, inputWestAmount} = data
    const usdpPartInPosition = usdpPart / ((1 - usdpPart) * westCollateral + usdpPart)
    const transferAmount = parseFloat(inputWestAmount + '')
    const westToUsdpAmount = usdpPartInPosition * transferAmount
    const eastAmount = (westToUsdpAmount * westRate) / usdpPart
    const usdpAmount = westToUsdpAmount * westRate / usdapRate
    return {
      eastAmount,
      usdpAmount
    }
  }
}
