export interface ITokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export enum EastOpType {
  mint = 'mint',
  transfer = 'transfer',
  reissue = 'reissue',
  supply = 'supply',
  close_init = 'close_init',
  close = 'close',
  claim_overpay_init = 'claim_overpay_init',
  claim_overpay = 'claim_overpay'
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

export interface ITransaction {
  status: string;
  transactionType: EastOpType;
  address: string;
  callHeight: number;
  callTimestamp: string;
  callTxId: string;
  executedHeight: number;
  initHeight: null | number;
  params: {
    transferId?: string;
    eastAmount?: number;
    to?: string;
  };
  requestTxId: null | string;
  eastAmountDiff: string;
  usdpAmountDiff: string;
  westAmountDiff: string;
}