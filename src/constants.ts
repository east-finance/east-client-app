export const WestDecimals = 8

export enum BatchOperation {
  liquidate = 'liquidate',
  postponeLiquidation = 'postponeLiquidation',
  overpay = 'overpay'
}

export enum OracleStreamId {
  WestRate = '000003_latest',
  UsdapRate = '000010_latest'
}
