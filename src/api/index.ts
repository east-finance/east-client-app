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

export class Api {
  private _unauthorizedClient: AxiosInstance = axios.create({
    baseURL: AUTH_SERVICE_ADDRESS + API_VERSION_PREFIX
  })
  private _apiClient!: AxiosInstance

  public signIn  = async (username: string, password: string): Promise<ITokenPair> => {
    const { data: tokenPair } = await this._unauthorizedClient.post('/auth/login', { username, password })
    await this.setupApi(tokenPair)
    return tokenPair
  }

  public signUp  = async (username: string, password: string): Promise<ITokenPair> => {
    const { data } = await this._unauthorizedClient.post('/user', { username, password, source: 'east_client' })
    return data
  }

  public changePassword  = async (password: string): Promise<ITokenPair> => {
    const { data } = await this._apiClient.post(`${AUTH_SERVICE_ADDRESS}/v1/user/password/change`, {
      password, passwordRepeat: password
    })
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

  public getNodeConfig = async () => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/node/config`)
    return data
  }

  public getAddressesTransactions = async (address: string) => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/transactions/address/${address}/limit/500`)
    return data
  }

  public getContractState = async (contractId: string, matches = '', limit = 20) => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/contracts/${contractId}?matches=${matches}&limit=${limit}`)
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

  public getContractStateValue = async (contractId: string, key: string): Promise<{ key: string; type: string; value: string }> => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/contracts/${contractId}/${key}`)
    return data
  }
}
