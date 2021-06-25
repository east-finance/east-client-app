import axios, { AxiosInstance } from 'axios'
import { ApiTokenRefresher } from '@wavesenterprise/api-token-refresher'
import {
  ITokenPair,
  IVault,
} from '../interfaces'
import { OracleStreamId } from '../constants'
import { IEastBalanceResponse, IOracleValue } from './ApiInterfaces'

const AUTH_SERVICE_ADDRESS = '/authServiceAddress'
const NODE_ADDRESS = '/nodeAddress'
const API_ADDRESS = '/apiAddress'
const API_VERSION_PREFIX = '/v1'
const source = 'east-client'

export class Api {
  private _unauthorizedClient: AxiosInstance = axios.create({
    baseURL: AUTH_SERVICE_ADDRESS + API_VERSION_PREFIX
  })
  private _apiClient!: AxiosInstance

  public setupApi = async (tokenPair: ITokenPair, onRefreshFailed: () => void) => {
    const refreshCallback = async (token: string) => {
      try {
        const { data } = await axios.post(`${AUTH_SERVICE_ADDRESS}/v1/auth/refresh`, { token })
        // console.log('JWT token refreshed')
        return data
      } catch (e) {
        console.error('JWT token refresh failed:', e.message)
        onRefreshFailed()
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

  // Auth requests
  public signIn  = async (username: string, password: string): Promise<ITokenPair> => {
    const { data: tokenPair } = await this._unauthorizedClient.post('/auth/login', { username, password })
    return tokenPair
  }

  public signUp  = async (username: string, password: string): Promise<ITokenPair> => {
    const { data } = await this._unauthorizedClient.post('/user', { username, password, source })
    return data
  }

  public changePassword  = async (password: string): Promise<ITokenPair> => {
    const { data } = await this._apiClient.post(`${AUTH_SERVICE_ADDRESS}/v1/user/password/change`, {
      password,
      passwordRepeat: password
    })
    return data
  }

  public sendPasswordRecover = async (email: string) => {
    const { data } = await this._unauthorizedClient.post('/user/password/restore', { email, source })
    return data
  }

  public resetPassword = async (token: string, password: string) => {
    const { data } = await this._unauthorizedClient.post('/user/password/reset', { token, password })
    return data
  }

  public confirmUser = async (token: string) => {
    const { data } = await this._unauthorizedClient.get(`/user/confirm/${token}`)
    return data
  }

  // Node requests
  public getNodeConfig = async () => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/node/config`)
    return data
  }

  public getAddressBalance = async (address: string) => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/addresses/balance/${address}`)
    return data
  }

  public getContractState = async (contractId: string, matches = '', limit = 20) => {
    const { data } = await this._apiClient.get(`${NODE_ADDRESS}/contracts/${contractId}?matches=${matches}&limit=${limit}`)
    return data
  }

  // API requests
  public getOracleValues = async (streamId: OracleStreamId, limit?: number): Promise<IOracleValue[]> => {
    let url = `${API_ADDRESS}/v1/user/oracles?streamId=${streamId}`
    if (limit) {
      url += `&limit=${limit}`
    }
    const { data } = await this._apiClient.get(url)
    return data
  }

  public getUserEastBalance = async (address: string): Promise<IEastBalanceResponse> => {
    const { data } = await this._apiClient.get(`${API_ADDRESS}/v1/user/balance?address=${address}`)
    return data
  }

  public getVault = async (address: string): Promise<IVault> => {
    const { data } = await this._apiClient.get(`${API_ADDRESS}/v1/user/vault?address=${address}`)
    return data
  }

  public getTransactionsHistory = async (address: string, limit?: number, offset?: number): Promise<IEastBalanceResponse> => {
    const { data } = await this._apiClient.get(`${API_ADDRESS}/v1/user/transactions?address=${address}`)
    return data
  }
}
