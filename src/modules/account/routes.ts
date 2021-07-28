import { RouteSegment } from '../../router/segments'

export default {
  name: RouteSegment.account,
  path: '/account',
  children: [{
    name: RouteSegment.buyEast,
    path: '/buy-east'
  }, {
    name: RouteSegment.addEast,
    path: '/add-east?eastAmount&westAmount&step'
  }, {
    name: RouteSegment.supply,
    path: '/supply'
  }, {
    name: RouteSegment.takeWest,
    path: '/takeWest'
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
  }, {
    name: RouteSegment.closeVault,
    path: '/closeVault'
  }]
}
