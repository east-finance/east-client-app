export const buildRouteName = (...routeNames: string[]): string => routeNames.join('.')

export const RouteSegment = {
  auth: 'auth',
  signIn: 'sign-in',
  signUp: 'sign-up',
  signInWallet: 'sign-in-wallet',
  passwordRecovery: 'password-recovery',
  passwordRestore: 'password-restore',
  activate: 'activate',
  passwordReset: 'password-reset',
  account: 'account',
  buyEast: 'buyEast',
  supply: 'supply',
  addEast: 'addEast',
  takeWest: 'takeWest',
  batches: 'batches',
  transfer: 'transfer',
  transactions: 'transactions',
  settings: 'settings',
  faq: 'faq',
  closeVault: 'closeVault'
}

export const RouteName = {
  SignIn: buildRouteName(RouteSegment.auth, RouteSegment.signIn),
  SignInWallet: buildRouteName(RouteSegment.auth, RouteSegment.signInWallet),
  SignUp: buildRouteName(RouteSegment.auth, RouteSegment.signUp),
  PasswordRecovery: buildRouteName(RouteSegment.auth, RouteSegment.passwordRecovery),
  PasswordReset: buildRouteName(RouteSegment.auth, RouteSegment.passwordRestore, RouteSegment.passwordReset),
  ConfirmUser: buildRouteName(RouteSegment.auth, RouteSegment.activate),
  Account: buildRouteName(RouteSegment.account),
  Batches: buildRouteName(RouteSegment.account, RouteSegment.batches),
  BuyEast: buildRouteName(RouteSegment.account, RouteSegment.buyEast),
  AddEast: buildRouteName(RouteSegment.account, RouteSegment.addEast),
  TakeWest: buildRouteName(RouteSegment.account, RouteSegment.takeWest),
  SupplyVault: buildRouteName(RouteSegment.account, RouteSegment.supply),
  TransferEast: buildRouteName(RouteSegment.account, RouteSegment.transfer),
  TransactionsHistory: buildRouteName(RouteSegment.account, RouteSegment.transactions),
  AccountSettings: buildRouteName(RouteSegment.account, RouteSegment.settings),
  Faq: buildRouteName(RouteSegment.account, RouteSegment.faq),
  CloseVault: buildRouteName(RouteSegment.account, RouteSegment.closeVault),
}

export const DefaultRouteName = RouteName.SignIn
