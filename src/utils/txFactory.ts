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
  eastAmount: number;
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
        eastAmount: props.eastAmount
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
  vaultId: string;
  fee: string;
}

export const claimOverpay = (props: IClaimOverpay) => {
  return {
    senderPublicKey: props.publicKey,
    authorPublicKey: props.publicKey,
    contractId: props.contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'claim_overpay_init',
      value: JSON.stringify({ vaultId: props.vaultId })
    }],
    fee: props.fee,
  }
}
