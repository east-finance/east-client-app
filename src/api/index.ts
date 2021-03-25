import axios, { AxiosInstance } from 'axios'
import { ApiTokenRefresher } from '@wavesenterprise/api-token-refresher'
import {
  ITokenPair,
} from '../interfaces'

const AUTH_SERVICE_ADDRESS = '/authServiceAddress'
const API_ADDRESS = '/backendAddress'
const API_VERSION_PREFIX = '/v1'

export class Api {
  private _unauthorizedClient: AxiosInstance = axios.create({
    baseURL: AUTH_SERVICE_ADDRESS + API_VERSION_PREFIX
  })
  private _apiClient!: AxiosInstance

  public signIn  = async (username: string, password: string): Promise<ITokenPair> => {
    const { data: tokenPair } = await this._unauthorizedClient.post(
      '/auth/login',
      {
        username,
        password
      }
    )

    await this.setupApi(tokenPair)

    return tokenPair
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
      axiosRequestConfig: {
        baseURL: API_ADDRESS + '/v1'
      }
    })
    const { axios: refresherAxios } = apiTokenRefresher.init()
    this._apiClient = refresherAxios
    return tokenPair
  }
}
