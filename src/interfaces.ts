export interface ITokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface IBatch {
  eastAmount: number,
  westAmount: number,
  usdpAmount: number,
}
