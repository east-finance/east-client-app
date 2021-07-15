import { RouteSegment } from '../../router/segments'

export default {
  name: RouteSegment.auth,
  path: '/auth',
  children: [{
    name: RouteSegment.signIn,
    path: '/sign-in?email'
  }, {
    name: RouteSegment.signUp,
    path: '/sign-up'
  }, {
    name: RouteSegment.signInSelectType,
    path: '/select-type'
  }, {
    name: RouteSegment.signInSeed,
    path: '/seed'
  }, {
    name: RouteSegment.signInWallet,
    path: '/connect-wallet'
  }, {
    name: RouteSegment.passwordRecovery,
    path: '/recover'
  }, {
    name: RouteSegment.passwordRestore,
    path: '/restore',
    children: {
      name: RouteSegment.passwordReset,
      path: '/reset-password?token&email'
    }
  }, {
    name: RouteSegment.activate,
    path: '/activate?token'
  }]
}
