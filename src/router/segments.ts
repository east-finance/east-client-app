export const buildRouteName = (...routeNames: string[]): string => routeNames.join('.')

export const RouteSegment = {
  auth: 'auth',
  signIn: 'sign-in'
}

export const RouteName = {
  SignIn: buildRouteName(RouteSegment.auth, RouteSegment.signIn),
}

export const DefaultRouteName = RouteName.SignIn
