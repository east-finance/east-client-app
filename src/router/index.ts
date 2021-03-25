import createRouter from 'router5'
import browserPlugin from 'router5-plugin-browser'
import { DefaultRouteName } from './segments'
import authRoutes from '../modules/auth/routes'

const routes = [
  authRoutes
]

export const router = createRouter(routes, {
  defaultRoute: DefaultRouteName
})

router.usePlugin(browserPlugin())

router.start()
