import axios, { AxiosInstance } from 'axios'
import { ApiTokenRefresher } from '@wavesenterprise/api-token-refresher'
import {
  IBatch,
  ITokenPair,
} from '../interfaces'

const AUTH_SERVICE_ADDRESS = '/authServiceAddress'
const NODE_ADDRESS = '/nodeAddress'
const API_ADDRESS = '/apiAddress'
const API_VERSION_PREFIX = '/v1'

/*
* address: "3Nr3w79QHmBQkFJ4cBmvaD7L1bErUMtLuSL"
createdAt: "2021-05-13T13:37:57.102Z"
eastAmount: "3.497142857142857"
id: 3
usdpAmount: "1.7485714285714284"
usdpRateTimestamp: "2021-05-13T13:37:57.095Z"
vaultId: "43VNkCqW1h8VMfvoDQ7hmiBiAcdPNkFtKPwYxXuvjSLR"
westAmount: "12.857142857142858"
westRateTimestamp: "2021-05-13T13:37:57.095Z"
* */

export class Api {
  private _unauthorizedClient: AxiosInstance = axios.create({
    baseURL: AUTH_SERVICE_ADDRESS + API_VERSION_PREFIX
  })
  private _apiClient!: AxiosInstance
  private _nodeClient!: AxiosInstance

  public signIn  = async (username: string, password: string): Promise<ITokenPair> => {
    const { data: tokenPair } = await this._unauthorizedClient.post('/auth/login', { username, password })
    await this.setupApi(tokenPair)
    return tokenPair
  }

  public signUp  = async (username: string, password: string): Promise<ITokenPair> => {
    const { data } = await this._unauthorizedClient.post('/user', { username, password, source: 'east_client' })
    return data
  }

  public setupApi = async (tokenPair: ITokenPair) => {
    const refreshCallback = async (token: string) => {
      try {
        const { data } = await axios.post(`${AUTH_SERVICE_ADDRESS}/v1/auth/refresh`, { token })
        console.log('token refreshed')
        return data
      } catch (e) {
        console.log('refresh failed relogin')
        // return getTokens()
      }
    }

    const apiTokenRefresher: ApiTokenRefresher = new ApiTokenRefresher({
      authorization: tokenPair,
      refreshCallback,
      // axiosRequestConfig: {
      //   baseURL: API_ADDRESS + '/v1'
      // }
    })
    const { axios: refresherAxios } = apiTokenRefresher.init()
    this._apiClient = refresherAxios
    return tokenPair
  }

  public getAddressesTransactions = async (address: string) => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/transactions/address/${address}/limit/500`)
    return data
  }

  public sendPasswordRecover = async (email: string) => {
    const { data } = await this._unauthorizedClient.post('/user/password/restore', { email })
    return data
  }

  public getAddressBalance = async (address: string) => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/addresses/balance/${address}`)
    return data
  }

  public getBatches = async (address: string): Promise<IBatch[]> => {
    const { data } = await this._apiClient.get(`${API_ADDRESS}/v1/user/vaults?address=${address}`)
    return data
  }
}
