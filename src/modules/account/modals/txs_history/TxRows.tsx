import React from 'react'
import moment from 'moment'
import { ContractExecutionStatus, EastOpType, ITransaction, TxCallStatus } from '../../../../interfaces'
import useStores from '../../../../hooks/useStores'
import { roundNumber } from '../../../../utils'
import { Block } from '../../../../components/Block'
import styled from 'styled-components'
import { shineBatch } from '../../../../components/Animations'
import { GradientText } from '../../../../components/Text'


const EastOpTypeName = {
  [EastOpType.mint]: 'Create vault',
  [EastOpType.transfer]: 'Transfer',
  [EastOpType.close_init]: 'Initialize vault close',
  [EastOpType.close]: 'Close vault',
  [EastOpType.supply]: 'Supply vault',
  [EastOpType.reissue]: 'Reissue vault',
  [EastOpType.claim_overpay_init]: 'Claim overpay init',
  [EastOpType.claim_overpay]: 'Claim overpay',
  [EastOpType.liquidate]: 'Liquidate vault',
}

const getEastOpTypeName  = (opType: EastOpType) => {
  return EastOpTypeName[opType] || opType
}

const ItemColumn = styled.div`
  text-align: left;
`

const ItemContainer = styled.div`
  display: flex;
  height: min(76px, 10vh);
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px;
  background: linear-gradient(180deg, #F2F2F2 0%, #EDEDED 100%);
  border-radius: 4px;
  margin-bottom: 8px;
  
  :last-child {
    margin-bottom: 24px;
  }
`

export const TxItemSkeleton = styled(ItemContainer)`
  background-image: linear-gradient(90deg, #EDEDED 0px, #e8e8e8 40px, #EDEDED 80px);
  background-size: 576px;
  animation: ${shineBatch} 1.6s infinite linear;
`

const ExplorerLink = styled(GradientText)`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
`

const PrimaryText = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  // line-break: anywhere;
`

const SecondaryText = styled.div`
  max-height: 70px;
  overflow: hidden;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #000000;
  word-break: break-all;
`

const Time = styled.div`
  font-size: 15px;
  line-height: 24px;
  color: ${props => props.theme.darkBlue50};
`

const StatusErrorMessage = styled.span`
  opacity: 0.4;
  font-size: 80%;
  line-height: 16px;
`

const TxStatusHOC = (props: { status: ContractExecutionStatus, children: JSX.Element[] }) => {
  if (props.status !== ContractExecutionStatus.fail) {
    return <TxItemSkeleton>
      {props.children}
    </TxItemSkeleton>
  }
  return <ItemContainer>
    {props.children}
  </ItemContainer>
}

export const TxStatus = (props: { tx: TxCallStatus}) => {
  const { tx } = props
  const { type, status, timestamp, error } = tx
  const date = moment(timestamp).format('MMM D')
  const time = moment(timestamp).format('HH:mm')

  const primaryText = status
  let description: any = getEastOpTypeName(type)
  if (error) {
    // description += ` error: ${error}`
    description = <span>
      {description} error: <StatusErrorMessage>{error}</StatusErrorMessage>
    </span>
  }
  return <TxStatusHOC status={status}>
    <ItemColumn style={{ width: '25%', lineHeight: '16px' }}>
      <PrimaryText style={{ color: status === ContractExecutionStatus.fail ? '#F0222B' : 'unset' }}>{primaryText}</PrimaryText>
    </ItemColumn>
    <ItemColumn style={{ width: '55%' }}>
      <SecondaryText>{description}</SecondaryText>
    </ItemColumn>
    <ItemColumn>
      <Time>{date}</Time>
      <Time>{time}</Time>
    </ItemColumn>
  </TxStatusHOC>
}

export const TxItem = (props: { tx: ITransaction}) => {
  const { configStore } = useStores()
  const { tx } = props
  const { transactionType, eastAmountDiff, westAmountDiff, callTimestamp, params, callTxId, requestTxId } = tx
  const date = moment(callTimestamp).format('MMM D')
  const time = moment(callTimestamp).format('HH:mm')
  const isReceived = +eastAmountDiff > 0
  const isReceivedWest = +westAmountDiff > 0

  let explorerTxId = callTxId

  let eastDiff = roundNumber(eastAmountDiff, 8).toString()
  if (isReceived) {
    eastDiff = '+' + eastDiff
  }
  let westDiff = roundNumber(westAmountDiff, 8).toString()
  if (isReceivedWest) {
    westDiff = '+' + westDiff
  }

  let primaryText = ''
  let description = getEastOpTypeName(transactionType)
  if (transactionType === EastOpType.transfer) {
    primaryText = `${eastDiff} EAST`
    description = isReceived
      ? `Transfer from ${tx.address}`
      : `Transfer to ${params.to}`
  } else if (transactionType === EastOpType.mint) {
    primaryText = `${eastDiff} EAST`
  } else if (transactionType === EastOpType.close_init) {
    primaryText = `${eastDiff} EAST`
    if (requestTxId) {
      explorerTxId = requestTxId
    }
  } else if (transactionType === EastOpType.close) {
    primaryText = `${eastDiff} EAST`
  } else if (transactionType === EastOpType.supply) {
    primaryText = `${westDiff} WEST`
  } else if (transactionType === EastOpType.reissue) {
    primaryText = `${eastDiff} EAST`
  } else if (transactionType === EastOpType.claim_overpay) {
    primaryText = `${westDiff} WEST`
  } else if (transactionType === EastOpType.liquidate) {
    primaryText = `${westDiff} WEST`
  } else {
    primaryText = `${eastDiff} EAST`
  }
  const onExplorerLinkClicked = (txId: string) => {
    const clientAddress = configStore.getClientAddress()
    window.open(`${clientAddress}/explorer/transactions/id/${txId}`, '_blank')
  }
  return <ItemContainer>
    <ItemColumn style={{ width: '25%', lineHeight: '16px' }}>
      <PrimaryText>{primaryText}</PrimaryText>
      <Block marginTop={8}>
        <ExplorerLink onClick={() => onExplorerLinkClicked(explorerTxId)}>Explorer</ExplorerLink>
      </Block>
    </ItemColumn>
    <ItemColumn style={{ width: '55%' }}>
      <SecondaryText>{description}</SecondaryText>
    </ItemColumn>
    <ItemColumn>
      <Time>{date}</Time>
      <Time>{time}</Time>
    </ItemColumn>
  </ItemContainer>
}
