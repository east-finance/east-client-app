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
  usdpRateTimestamp: string;
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
