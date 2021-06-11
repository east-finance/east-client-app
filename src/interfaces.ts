export interface ITokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface IBatch {
  id: number;
  vaultId: string;
  address: string;
  createdAt: string;
  eastAmount: string;
  usdpAmount: string;
  usdapRateTimestamp: string;
  westAmount: string;
  westRateTimestamp: string;
  westRate: string;
}

export enum TransactionType {
  mint = 'mint',
  transfer = 'transfer',
  supply = 'supply'
}

export interface ITransaction {
  transactionType: TransactionType,
  callTxId: string;
  callTimestamp: string,
  info: {
    eastAmount: number;
    usdpAmount?: number;
    westAmount?: number;
  }
}

export interface IVault {
  id: number;
  address: string;
  createdAt: string;
  eastAmount: string;
  usdpAmount: string;
  usdpRate: string;
  usdpRateTimestamp: string;
  vaultId: string;
  westAmount: string;
  westRate: string;
  westRateTimestamp: string;
}

export enum EastOpType {
  mint = 'mint',
  transfer = 'transfer',
  reissue = 'reissue',
  supply = 'supply',
  close_init = 'close_init',
  claim_overpay_init = 'claim_overpay_init'
}