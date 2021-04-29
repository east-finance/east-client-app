export interface ITokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface IBatch {
  id: string;
  eastAmount: number;
  westAmount: number;
  usdpAmount: number;
  westRate: number;
  createdAt: number
}
