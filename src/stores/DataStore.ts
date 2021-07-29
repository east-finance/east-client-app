import { makeAutoObservable, runInAction } from 'mobx'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { OracleStreamId, WestDecimals } from '../constants'
import { IOracleValue, IVault } from '../interfaces'
import ConfigStore from './ConfigStore'
import { roundNumber, cutNumber } from '../utils'
import { PollingError } from '../api/apiErrors'

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
  vault: IVault = {...emptyUserVault}
  westBalance = '0.0'
  eastBalance = '0.0'
  westRate = '0'
  usdapRate = '0'
  westRatesHistory: IOracleValue[] = []
  pollingId: number | null = null

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
    const currentVaultCollateral = (+this.vault.westAmount * +this.westRate) / (+this.vault.eastAmount * westPart * +this.usdapRate)
    return roundNumber(currentVaultCollateral, 2)
  }

  // How many west need to supply vault to 250%
  // If value < 0, vault is over-supplied and contains free west
  get supplyVaultWestDiff () {
    const diff = roundNumber(this.expectedVaultWestAmount - +this.vault.westAmount, 6)
    if (Math.abs(diff) > 0.01) {
      return diff
    }
    return 0
  }

  get vaultFreeWest () {
    return -this.supplyVaultWestDiff
  }

  get vaultEastProfit () {
    const westAmount = this.vaultFreeWest
    const data = this.calculateEastAmount({ westAmount })
    return data
  }

  get vaultEastAmount () {
    return this.vault.eastAmount || '0'
  }

  get transferedEastAmount () {
    return (+this.eastBalance - +this.vaultEastAmount).toString() || '0'
  }

  async getEastBalance(address: string): Promise<string> {
    const { eastAmount } = await this.api.getUserEastBalance(address)
    return cutNumber(eastAmount, 8) || '0'
  }

  async getWestBalance(address: string): Promise<string> {
    const { balance } = await this.api.getAddressBalance(address)
    const westBalance = new BigNumber(balance).dividedBy(Math.pow(10, WestDecimals)).toString()
    return roundNumber(westBalance, 8).toString()
  }

  calculateWestAmount (eastAmount: string | number) {
    const usdpPart = this.configStore.getUsdpPart()
    const westCollateral = this.configStore.getWestCollateral()
    const westRate = +this.westRate

    const westAmount = +eastAmount * ((usdpPart / westRate) + ((1 - usdpPart) / westRate * westCollateral))
    return roundNumber(westAmount, 7)
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
      usdpAmount: roundNumber(usdpAmount, 8),
      westAmount: roundNumber(+westAmount - westToUsdpAmount, 8)
    }
  }

  exchangeWest (westAmount: string | number) {
    const rwaPart = this.configStore.getUsdpPart()
    const eastAmount = (+westAmount * +this.westRate) / rwaPart
    const rwaAmount = +westAmount * +this.westRate / +this.usdapRate
    return {
      eastAmount,
      rwaAmount
    }
  }

  exchangeEast (eastAmount: string | number) {
    const rwaPart = this.configStore.getUsdpPart()
    const westAmount  = (+eastAmount * rwaPart) / +this.westRate
    return roundNumber(westAmount, 8)
  }


  sleep(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  async pollData (address: string) {
    const [vault, eastBalance, westBalance, westRates, usdapRates] = await Promise.all([
      this.api.getVault(address),
      this.getEastBalance(address),
      this.getWestBalance(address),
      this.api.getOracleValues(OracleStreamId.WestRate, 50),
      this.api.getOracleValues(OracleStreamId.UsdapRate, 1)
    ])

    if(westRates.length === 0 || usdapRates.length === 0) {
      throw new Error(PollingError.EmptyOracleData)
    }

    const [{ value: westRate }] = westRates
    const [{ value: usdapRate }] = usdapRates

    runInAction(() => {
      this.vault = vault
      this.eastBalance = eastBalance
      this.westBalance = westBalance
      this.westRate = westRate
      this.westRatesHistory = westRates
      this.usdapRate = usdapRate
    })

    return {
      westRate,
      usdapRate,
      eastBalance,
      westBalance
    }
  }

  async startPolling (address: string, initialStart = true) {
    if(this.pollingId) {
      clearTimeout(this.pollingId)
    } else {
      console.log('Start polling user data')
    }

    const runNextPoll = () => {
      runInAction(() => {
        this.pollingId = setTimeout(() => this.startPolling(address, false), 5000)
      })
    }

    if (initialStart) {
      await this.pollData(address)
      runNextPoll()
    } else {
      try {
        await this.pollData(address)
      } catch (e) {
        console.error('Polling error:', e.message)
      } finally {
        runNextPoll()
      }
    }
  }

  stopPolling () {
    console.log('Stop polling user data')
    if (this.pollingId) {
      clearTimeout(this.pollingId)
    }
  }

  logout () {
    this.stopPolling()
    runInAction(() => {
      this.vault = {...emptyUserVault}
    })
  }
}
