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
    name: RouteSegment.signInWallet,
    path: '/sign-in-wallet'
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
  }]
}
