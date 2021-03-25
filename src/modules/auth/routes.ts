import { RouteSegment } from '../../router/segments'

export default {
  name: RouteSegment.auth,
  path: '/auth',
  children: [{
    name: RouteSegment.signIn,
    path: '/sign-in'
  }]
}
