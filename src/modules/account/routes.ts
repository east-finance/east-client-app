import { RouteSegment } from '../../router/segments'

export default {
  name: RouteSegment.account,
  path: '/',
  children: [{
    name: RouteSegment.buyEast,
    path: '/buy-east'
  }, {
    name: RouteSegment.batches,
    path: '/batches'
  }, {
    name: RouteSegment.transactions,
    path: '/transactions'
  }, {
    name: RouteSegment.transfer,
    path: '/transfer'
  }, {
    name: RouteSegment.settings,
    path: '/settings'
  }, {
    name: RouteSegment.faq,
    path: '/faq'
  }]
}
