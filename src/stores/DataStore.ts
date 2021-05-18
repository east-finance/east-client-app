import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { WestDecimals } from '../constants'
import { IBatch } from '../interfaces'
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
  westPriceHistory: IDataPoint[] = []
  pollingId: any = null
  eastBalance = '0.0'

  constructor(api: Api, configStore: ConfigStore) {
    makeAutoObservable(this)
    this.api = api
    this.configStore = configStore
  }

  sleep(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout)
    })
  }

  async pollOracleTxs () {
    // TODO remove hardcode
    const [data] = await this.api.getAddressesTransactions('3NfpckQUCNA3Bi2t92BWvcszna4NJ7inA7f')
    console.log('data', data)
    const filteredTxs = data.reverse().map((tx: any) => {
      const { type, params = [], timestamp, height } = tx
      if (type === 104 && params.find((param: any) => param.value.includes(`${StreamId.WEST_USD}_regular_data_request_`))) {
        const { value } = params.find((param: any) => param.key === 'value')
        return {
          value: +value,
          timestamp,
          height
        }
      }
    }).filter((item: IDataPoint | undefined) => item)
    console.log('filteredTxs', filteredTxs)
    this.westPriceHistory = filteredTxs
  }

  async startPolling (address: string) {
    const updateEastBalance = async () => {
      try {
        this.eastBalance = await this.getEastBalance(address)
      } catch (e) {
        console.log(`Polling error: cannot get address ${address} vaults`, e.message)
      }
    }

    const updateData = async () => {
      await updateEastBalance()
      // await this.pollOracleTxs()
    }

    clearInterval(this.pollingId)
    await updateData()
    this.pollingId = setInterval(updateData, 10000)
  }

  async getEastBalance(address: string): Promise<string> {
    const contractId =  this.configStore.getEastContractId()
    if (contractId) {
      const { value } = await this.api.getContractStateValue(contractId, `balance_${address}`)
      return value
    }
    return ''
  }

  async getWestBalance(address: string): Promise<string> {
    const { balance } = await this.api.getAddressBalance(address)
    return new BigNumber(balance).dividedBy(Math.pow(10, WestDecimals)).toString()
  }

  async getOracleTokenPrices (contractId: string) {
    const data = await this.api.getContractState(contractId, '(000003|000010)_latest') //(000003|000010)_regular_data_request_.*
    let westRate = '0'
    let usdpRate = '0'
    data.forEach((item: any) => {
      const { value, timestamp } = JSON.parse(item.value)
      if (item.key === '000010_latest') {
        usdpRate = value
      } else if(item.key === '000003_latest') {
        westRate = value
      }
    })
    return {
      westRate,
      usdpRate
    }
  }

  calculateWestAmount (data: any) {
    const { usdpPart, westCollateral, westRate, inputEastAmount } = data
    return {
      westAmount: inputEastAmount * ((usdpPart / westRate) + ((1 - usdpPart) / westRate * westCollateral))
    }
  }

  calculateEastAmount (data: any) {
    const { usdpPart, westCollateral, westRate, usdpRate, inputWestAmount} = data
    const usdpPartInPosition = usdpPart / ((1 - usdpPart) * westCollateral + usdpPart)
    const transferAmount = parseFloat(inputWestAmount + '')
    const westToUsdpAmount = usdpPartInPosition * transferAmount
    const eastAmount = (westToUsdpAmount * westRate) / usdpPart
    const usdpAmount = westToUsdpAmount * westRate / usdpRate
    return {
      eastAmount,
      usdpAmount
    }
  }
}
