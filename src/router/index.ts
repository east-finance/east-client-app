import createRouter from 'router5'
import browserPlugin from 'router5-plugin-browser'
import { DefaultRouteName } from './segments'
import authRoutes from '../modules/auth/routes'
import accountRoutes from '../modules/account/routes'

const routes = [
  authRoutes,
  accountRoutes
]

export const router = createRouter(routes, {
  defaultRoute: DefaultRouteName
})

router.usePlugin(browserPlugin())

router.start()
