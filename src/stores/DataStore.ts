import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { WestDecimals } from '../constants'
import { IBatch } from '../interfaces'

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
  westPriceHistory: IDataPoint[] = []
  pollingId: any = null
  eastBalance = '0.0'

  constructor(api: Api) {
    makeAutoObservable(this)
    this.api = api
    this.start()
  }

  sleep(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout)
    })
  }

  async start () {
    try {
      // await this.pollOracleTxs()
    } finally {
      await this.sleep(300 * 1000)
      this.start()
    }
  }

  async pollOracleTxs () {
    const [data] = await this.api.getAddressesTransactions()
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
    }

    clearInterval(this.pollingId)
    await updateData()
    this.pollingId = setInterval(updateData, 5000)
  }

  async getEastBalance(address: string): Promise<string> {
    const batches = await this.api.getBatches(address)
    return batches.reduce((amount: number, batch: IBatch) => amount + +batch.eastAmount, 0).toString()
  }

  async getWestBalance(address: string): Promise<string> {
    const { balance } = await this.api.getAddressBalance(address)
    return new BigNumber(balance).dividedBy(Math.pow(10, WestDecimals)).toString()
  }
}
