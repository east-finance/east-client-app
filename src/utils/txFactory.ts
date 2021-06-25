export interface IAtomicTransfer {
  recipient: string;
  amount: string;
  fee: string;
  trustedSender: string;
}

export const atomicTransfer = (props: IAtomicTransfer) => {
  const { recipient, amount, fee, trustedSender } = props
  return {
    type: 'transferV3',
    tx: {
      recipient,
      assetId: 'WAVES',
      amount,
      fee,
      attachment: '',
      timestamp: Date.now(),
      atomicBadge: {
        trustedSender
      }
    }
  }
}

export interface IDockerCallMint {
  publicKey: string;
  contractId: string;
  trustedSender: string;
  transferId: string;
}

export const dockerCallMint = (props: IDockerCallMint) => {
  return {
    senderPublicKey: props.publicKey,
    authorPublicKey: props.publicKey,
    contractId: props.contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'mint',
      value: JSON.stringify({
        transferId: props.transferId
      })
    }],
    fee: '1000000',
    atomicBadge: {
      trustedSender: props.trustedSender
    }
  }
}

export interface IDockerCallTransfer {
  publicKey: string;
  contractId: string;
  recipient: string;
  amount: number;
}

export const dockerCallTransfer = (props: IDockerCallTransfer) => {
  return {
    senderPublicKey: props.publicKey,
    authorPublicKey: props.publicKey,
    contractId: props.contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'transfer',
      value: JSON.stringify({
        to: props.recipient,
        amount: props.amount
      })

    }],
    fee: '1000000',
  }
}

export interface ILiquidateVault {
  publicKey: string;
  contractId: string;
  vaultId: string;
  fee: string;
}

export const liquidateVault = (props: ILiquidateVault) => {
  return {
    senderPublicKey: props.publicKey,
    authorPublicKey: props.publicKey,
    contractId: props.contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'burn_init',
      value: JSON.stringify({ vaultId: props.vaultId })
    }],
    fee: props.fee,
  }
}

export interface IClaimOverpay {
  publicKey: string;
  contractId: string;
  fee: string;
  amount?: number;
}

export const claimOverpay = (props: IClaimOverpay) => {
  const { amount } = props
  let value = ''
  if (amount) {
    value = JSON.stringify({ amount })
  }
  return {
    senderPublicKey: props.publicKey,
    authorPublicKey: props.publicKey,
    contractId: props.contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'claim_overpay_init',
      value
    }],
    fee: props.fee,
  }
}

export interface ICloseVault {
  publicKey: string;
  contractId: string;
  fee: string;
}

export const closeVault = (params: ICloseVault) => {
  return {
    senderPublicKey: params.publicKey,
    authorPublicKey: params.publicKey,
    contractId: params.contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'close_init',
      value: ''
    }],
    fee: params.fee,
  }
}
