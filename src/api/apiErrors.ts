export enum AuthError {
  TokenExpired = 'token.expired',
  TokenAlreadyUsed = 'token.already.used',
  UserShouldBeConfirmed = 'user.should.be.confirmed',
  UserNotFound = 'user.not.found',
  WrongPassword = 'wrong.password',
  TooManyRequests = 'too.many.requests'
}

export enum PollingError {
  EmptyOracleData = 'empty.oracle.data'
}
