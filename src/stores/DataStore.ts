import { makeAutoObservable, runInAction } from 'mobx'
import axios from 'axios'
import { Api } from '../api'

enum StreamId {
  WEST_USD = '000003'
}

export interface IDataPoint {
  value: number;
  timestamp: number;
  height: number;
}

export default class DataStore {
  westPriceHistory: IDataPoint[] = []
  api

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
}
