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
  claim_overpay = 'claim_overpay',
  liquidate = 'liquidate'
}

export interface IVault {
  id: number;
  address: string;
  createdAt: string;
  eastAmount: string;
  rwaAmount: string;
  rwaRate: string;
  rwaRateTimestamp: string;
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
  rwaAmountDiff: string;
  westAmountDiff: string;
}

export enum TxTextType {
  transferV3 = 'transferV3',
  dockerCallV4 = 'dockerCallV4'
}
