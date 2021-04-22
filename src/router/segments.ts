export const buildRouteName = (...routeNames: string[]): string => routeNames.join('.')

export const RouteSegment = {
  auth: 'auth',
  signIn: 'sign-in',
  signUp: 'sign-up',
  signInWallet: 'sign-in-wallet',
}

export const RouteName = {
  SignIn: buildRouteName(RouteSegment.auth, RouteSegment.signIn),
  SignInWallet: buildRouteName(RouteSegment.auth, RouteSegment.signInWallet),
  SignUp: buildRouteName(RouteSegment.auth, RouteSegment.signUp),
}

export const DefaultRouteName = RouteName.SignIn
