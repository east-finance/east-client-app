import { makeAutoObservable } from 'mobx'
import decodeJWT, { JwtPayload } from 'jwt-decode'
import { ITokenPair } from '../interfaces'
import { Api } from '../api'
import { Router } from 'router5'
import { RouteName, RouteSegment } from '../router/segments'
import { Route } from 'react-router5'

const tokensLocalStorageKey = 'tokenPair'

interface WEJWTPayload extends JwtPayload {
  id: string;
  name: string;
}

export default class AuthStore {
  router: Router
  isLoggedIn = false
  isWalletAvailable = false
  walletState = {}

  id = ''
  email = ''
  password = ''
  address = ''
  westBalance = ''

  constructor(router: Router, api: Api) {
    this.router = router
    makeAutoObservable(this)
    this.initStore(router, api)
    this.startWalletObserver()
  }

  setSelectedAddress (address: string) {
    this.address = address
  }

  async initStore (router: Router, api: Api): Promise<void> {
    const { name, params } = router.getState()
    if (![RouteName.SignIn, RouteName.SignUp, RouteName.PasswordRecovery, RouteName.PasswordReset].includes(name)) { //!name.startsWith(RouteSegment.auth)
      router.navigate(RouteName.SignIn)
      // const tokenPair = this.readTokenPair()
      // if (tokenPair) {
      //   try {
      //     const { exp }: JwtPayload = decodeJWT(tokenPair.access_token)
      //     if (exp && (exp * 1000 - Date.now() > 0)) {
      //       const address = '3Nr3w79QHmBQkFJ4cBmvaD7L1bErUMtLuSL'
      //       if (address) {
      //         await api.setupApi(tokenPair)
      //         this.setSelectedAddress(address)
      //         this.loginWithTokenPair(tokenPair)
      //         this.setLoggedIn(true)
      //         router.navigate(RouteName.Account)
      //       } else {
      //         throw new Error('no address')
      //       }
      //     } else {
      //       this.deleteTokenPair()
      //       throw new Error('JWT expired')
      //     }
      //   } catch (e) {
      //     console.error('Login with tokens error:', e.message)
      //     router.navigate(RouteName.SignIn)
      //   }
      // } else {
      //   router.navigate(RouteName.SignIn)
      // }
    }
  }

  startWalletObserver () {
    // setInterval(() => this.pollWalletState(), 60 * 1000)
  }

  async pollWalletState () {
    this.isWalletAvailable = !!window.WEWallet
    if (this.isWalletAvailable && this.isLoggedIn) {
      try {
        const state = await window.WEWallet.publicState()
        this.walletState = state
        if (state && state.initialized) {
          if (state.account) {
            this.address = state.account.address
          }
        }
      } catch (e) {
        this.isWalletAvailable = false
        this.walletState = {}
        this.address = ''
        console.log('Cannot get WEWallet state:', e)
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
