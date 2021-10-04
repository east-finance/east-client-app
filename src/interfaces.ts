export enum TxTypeNumber {
  Transfer = 4,
  CreateContract = 103,
  CallContract = 104
}

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
  isActive:  boolean;
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

export interface IOracleValue {
  value: string;
  timestamp: string;
}

export interface IBlockchainTx {
  fee: number;
  timestamp: number;
  atomicBadge?: {
    trustedSender: string;
  }
}

export interface ITransferTx extends IBlockchainTx {
  recipient: string;
  amount: number;
  attachment: string;
}

export interface ICallContractParam {
  type: string;
  key: string;
  value: string;
}

export interface ICallContractTx extends IBlockchainTx {
  senderPublicKey: string;
  authorPublicKey: string;
  contractId: string;
  contractVersion: number;
  params: ICallContractParam[];
}

export interface IBroadcastCallTx extends ICallContractTx {
  id: string;
  sender: string;
}

export interface IWrappedBlockchainTx {
  type: TxTextType;
  tx: ICallContractTx | ITransferTx;
}

export enum ContractExecutionStatus {
  pending = 'pending',
  success = 'success',
  fail = 'fail',
}

export interface TxCallStatus {
  address: string;
  error: string | null;
  id: number;
  status: ContractExecutionStatus;
  tx_id: string;
  type: EastOpType;
  timestamp: string;
}

export interface IWatchTxRequest {
  id: string;
  type: EastOpType;
}
