import createRouter, { Router, State } from 'router5'
import browserPlugin from 'router5-plugin-browser'
import { DefaultRouteName, RouteSegment } from './segments'
import authRoutes from '../modules/auth/routes'
import accountRoutes from '../modules/account/routes'
import AuthStore from '../stores/AuthStore'

const routes = [
  authRoutes,
  accountRoutes
]

const isUserLoggedIn = (router:  Router) => {
  const deps = router.getDependencies()
  const authStore: AuthStore = deps.authStore
  return authStore ? authStore.isLoggedIn : false
}

export const router = createRouter(routes, {
  defaultRoute: DefaultRouteName
})

router.usePlugin(browserPlugin())

router.canActivate('account', (router: Router) => (toState, fromState, done) => {
  const isLoggedIn = isUserLoggedIn(router)
  if (!isLoggedIn) {
    done('User not logged in')
  } else {
    done()
  }
})

const logoutMiddleware = (router:Router) => (toState: State, fromState: State, done: any) => {
  const isLoggedIn = isUserLoggedIn(router)
  const { authStore } = router.getDependencies()
  if (isLoggedIn && toState.name.startsWith(RouteSegment.auth)) {
    if (authStore) {
      authStore.setLoggedIn(false)
    }
  }
  done()
}

router.useMiddleware(logoutMiddleware)

router.start()
