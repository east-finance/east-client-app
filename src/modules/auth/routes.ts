import { RouteSegment } from '../../router/segments'

export default {
  name: RouteSegment.auth,
  path: '/auth',
  children: [{
    name: RouteSegment.signIn,
    path: '/sign-in'
  }, {
    name: RouteSegment.signUp,
    path: '/sign-up'
  }, {
    name: RouteSegment.signInWallet,
    path: '/sign-in-wallet'
  }]
}
