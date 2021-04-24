import { makeAutoObservable } from 'mobx'
import decodeJWT, { JwtPayload } from 'jwt-decode'
import { ITokenPair } from '../interfaces'
import { Api } from '../api'
import { Router } from 'router5'
import { RouteName, RouteSegment } from '../router/segments'

const tokensLocalStorageKey = 'tokenPair'

interface WEJWTPayload extends JwtPayload {
  id: string;
  name: string;
}

export default class AuthStore {
  router: Router
  isLoggedIn = false

  id = ''
  email = ''
  password = ''
  address = 'test'

  constructor(router: Router, api: Api) {
    this.router = router
    makeAutoObservable(this)
    this.initStore(router, api)
  }

  async initStore (router: Router, api: Api): Promise<void> {
    const { name, params } = router.getState()
    if (!name.startsWith(RouteSegment.auth)) {
      const tokenPair = this.readTokenPair()
      if (tokenPair) {
        try {
          const { exp }: JwtPayload = decodeJWT(tokenPair.access_token)
          if (exp && (exp * 1000 - Date.now() > 0)) {
            await api.setupApi(tokenPair)
            this.loginWithTokenPair(tokenPair)
          } else {
            console.log('JWT tokens expired')
            this.deleteTokenPair()
            router.navigate(RouteName.SignIn)
          }
        } catch (e) {
          console.log('Login with tokens error:', e.message)
          router.navigate(RouteName.SignIn)
        }
      } else {
        router.navigate(RouteName.SignIn)
      }
    }
  }

  logout (): void {
    this.deleteTokenPair()
    this.setLoggedIn(false)
    this.router.navigate(RouteName.SignIn)
  }

  loginWithTokenPair (tokenPair: ITokenPair) {
    const { id, name }: WEJWTPayload = decodeJWT(tokenPair.access_token)
    this.id = id
    this.email = name
    this.writeTokenPair(tokenPair)
    this.setLoggedIn(true)
  }

  setLoggedIn (isLoggedIn: boolean): void {
    this.isLoggedIn = isLoggedIn
  }

  writeTokenPair (tokenPair: ITokenPair): void {
    window.localStorage.setItem(tokensLocalStorageKey, JSON.stringify(tokenPair))
  }

  deleteTokenPair (): void {
    window.localStorage.removeItem(tokensLocalStorageKey)
  }

  readTokenPair (): ITokenPair | null {
    const data = window.localStorage.getItem(tokensLocalStorageKey)
    if (data) {
      try {
        return JSON.parse(data)
      } catch (e) {
        return null
      }
    }
    return null
  }
}
