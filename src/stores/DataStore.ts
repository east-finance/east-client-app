import { makeAutoObservable, runInAction } from 'mobx'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { OracleStreamId, WestDecimals } from '../constants'
import { IOracleValue, IVault } from '../interfaces'
import ConfigStore from './ConfigStore'
import { roundNumber } from '../utils'
import { PollingError } from '../api/apiErrors'
import { toast } from 'react-toastify'

const toastErrorId = 'pollingErrorId'

const emptyUserVault: IVault = {
  id: 0,
  isActive: false,
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
  usdapRate = '1'
  westRatesHistory: IOracleValue[] = []
  pollingId: number | null = null
  pollingFailCounter = 0

  constructor(api: Api, configStore: ConfigStore) {
    makeAutoObservable(this)
    this.api = api
    this.configStore = configStore
  }

  // Calculated expected fully supplied (== 250%) vault west amount
  get expectedVaultWestAmount () {
    const expectedWestAmount = this.calculateWestAmount(this.vault.eastAmount)
    return roundNumber(expectedWestAmount, 8)
  }

  // Vault collateral percentage: converted from "expectedVaultWestAmount"
  get vaultCollateral () {
    const rwaPart = this.configStore.getRwaPart()
    const westPart = 1 - rwaPart
    const currentVaultCollateral = (+this.vault.westAmount * +this.westRate) / (+this.vault.eastAmount * westPart)
    return +roundNumber(currentVaultCollateral, 2)
  }

  // How many west need to supply vault to 250%
  // If value < 0, vault is over-supplied and contains free west
  get supplyVaultWestDiff () {
    const diff = +roundNumber(this.expectedVaultWestAmount - +this.vault.westAmount, 8)
    if (Math.abs(diff) > 0.0000001) {
      return diff
    }
    return 0
  }

  get vaultFreeWest () {
    return -this.supplyVaultWestDiff
  }

  get vaultEastProfit () {
    const westAmount = this.vaultFreeWest
    const data = this.calculateEastAmount(westAmount)
    return data
  }

  get vaultEastAmount () {
    return this.vault.eastAmount || '0'
  }

  get transferedEastAmount () {
    return (+this.eastBalance - +this.vaultEastAmount).toString() || '0'
  }

  // Available claim overpay profit
  get claimOverpayAmount () {
    return roundNumber(-this.supplyVaultWestDiff - this.configStore.getClaimOverpayFee())
  }

  async getEastBalance(address: string): Promise<string> {
    const { eastAmount } = await this.api.getUserEastBalance(address)
    return eastAmount
  }

  async getWestBalance(address: string): Promise<string> {
    const { available } = await this.api.getAddressBalance(address)
    const westBalance = new BigNumber(available).dividedBy(Math.pow(10, WestDecimals)).toString()
    return roundNumber(westBalance, 8).toString()
  }

  calculateWestAmount (eastAmount: string | number) {
    const usdpPart = this.configStore.getRwaPart()
    const westCollateral = this.configStore.getWestCollateral()
    const westRate = +this.westRate

    const westAmount = +eastAmount * ((usdpPart / westRate) + ((1 - usdpPart) / westRate * westCollateral))
    return +roundNumber(westAmount, 8)
  }

  calculateEastAmount (westAmount: string | number ) {
    const rwaPart = this.configStore.getRwaPart()
    const westCollateral = this.configStore.getWestCollateral()
    const westRate = +this.westRate
    const usdapRate = +this.usdapRate

    const usdpPartInPosition = rwaPart / ((1 - rwaPart) * westCollateral + rwaPart)
    const westToUsdpAmount = usdpPartInPosition * +westAmount

    const eastPriceInWest = (rwaPart / westRate) + ((1 - rwaPart) / westRate * westCollateral)
    const eastAmount = +westAmount / eastPriceInWest

    const usdpAmount = westToUsdpAmount * westRate / usdapRate
    return {
      eastAmount: +roundNumber(eastAmount, 8),
      usdpAmount: +roundNumber(usdpAmount, 8),
      westAmount: +roundNumber(+westAmount - westToUsdpAmount, 8)
    }
  }

  exchangeWest (westAmount: string | number) {
    const rwaPart = this.configStore.getRwaPart()
    const eastAmount = (+westAmount * +this.westRate) / rwaPart
    const rwaAmount = +westAmount * +this.westRate / +this.usdapRate
    return {
      eastAmount,
      rwaAmount
    }
  }

  exchangeEast (eastAmount: string | number) {
    const rwaPart = this.configStore.getRwaPart()
    const westAmount  = (+eastAmount * rwaPart) / +this.westRate
    return roundNumber(westAmount, 8)
  }


  sleep(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  async pollData (address: string): Promise<void> {
    const getOracleRates = async (streamId: OracleStreamId, limit: number) => {
      const rates = await this.api.getOracleValues(streamId, limit)
      if(!rates || (rates && rates.length === 0)) {
        throw new Error(PollingError.EmptyOracleData)
      }
      return rates
    }

    const promises = [
      this.api.getVault(address),
      this.getEastBalance(address),
      this.getWestBalance(address),
      getOracleRates(OracleStreamId.WestRate, 50)
    ]

    if (+this.configStore.getRwaPart() > 0) {
      promises.push(getOracleRates(OracleStreamId.UsdapRate, 1))
    }

    const values = await Promise.allSettled(promises)

    const [vault, eastBalance, westBalance, westRates, usdapRates] = values

    runInAction(() => {
      if (vault.status === 'fulfilled') {
        this.vault = vault.value as IVault
      } else {
        if (vault.reason && vault.reason.response && vault.reason.response.status === 404) {
          values.shift()
        } else {
          console.log('Cannot update vault:', vault.reason)
        }
      }
      if (eastBalance.status === 'fulfilled') {
        this.eastBalance = eastBalance.value as string
      } else {
        console.error('Cannot get eastBalance:', eastBalance.reason)
      }
      if (westBalance.status === 'fulfilled') {
        this.westBalance = westBalance.value as string
      } else {
        console.error('Cannot get west balance:', westBalance.reason)
      }
      if (westRates.status === 'fulfilled') {
        this.westRatesHistory = westRates.value as IOracleValue[]
        const [{ value: westRate }] = westRates.value as IOracleValue[]
        this.westRate = westRate
      } else {
        console.error('Cannot get westRates:', westRates.reason)
      }

      if (usdapRates) {
        if (usdapRates.status === 'fulfilled') {
          const [{ value: usdapRate }] = usdapRates.value as IOracleValue[]
          this.usdapRate = usdapRate
        } else {
          console.error('Cannot get usdapRate:', usdapRates.reason)
        }
      }
    })

    const errorItem = values.find(value => value.status === 'rejected')
    if (errorItem && errorItem.status === 'rejected') {
      throw new Error(errorItem.reason)
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
        if (this.pollingFailCounter > 0) {
          toast.dismiss()
          toast('User data is updated', {
            hideProgressBar: true,
            autoClose: 5 * 1000
          })
        }
        this.setPollingFailCounter(0)
        toast.dismiss(toastErrorId)
      } catch (e) {
        console.error('Polling error:', e.message)
        this.setPollingFailCounter(this.pollingFailCounter + 1)
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
    this.setPollingFailCounter(0)
  }

  setPollingFailCounter (value: number) {
    this.pollingFailCounter = value
    if (value > 0 && value === 3) {
      toast.dismiss(toastErrorId)
      toast('Cannot update data. Retry in 5 seconds', {
        toastId: toastErrorId,
        hideProgressBar: true,
        autoClose: 10 * 60 * 1000
      })
    }
  }

  logout () {
    this.stopPolling()
    runInAction(() => {
      this.vault = {...emptyUserVault}
    })
  }
}
