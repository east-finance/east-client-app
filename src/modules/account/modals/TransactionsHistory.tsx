import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block } from '../../../components/Block'
import { GradientText } from '../../../components/Text'
import { ContractExecutionStatus, EastOpType, ITransaction, TxCallStatus } from '../../../interfaces'
import useStores from '../../../hooks/useStores'
import { shineBatch } from '../../../components/Animations'
import { roundNumber } from '../../../utils'

interface IProps {
  onClose: () => void
}

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

const ItemsContainer = styled.div`
  margin-top: 32px;
  max-height: min(380px, 60vh);
  height: min(380px, 60vh);
  overflow-y: scroll;
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

const TxItemSkeleton = styled(ItemContainer)`
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
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #000000;
  word-break: break-word;
`

const Time = styled.div`
  font-size: 15px;
  line-height: 24px;
  color: ${props => props.theme.darkBlue50};
`

const PrimaryModalContainer = styled(PrimaryModal)`
`

const TxStatus = (props: { tx: TxCallStatus}) => {
  const { tx } = props
  const { type, status, timestamp } = tx
  const date = moment(timestamp).format('MMMM D')
  const time = moment(timestamp).format('HH:mm')

  const primaryText = status
  const description = getEastOpTypeName(type)
  return <TxItemSkeleton>
    <ItemColumn style={{ width: '25%', lineHeight: '16px' }}>
      <PrimaryText>{primaryText}</PrimaryText>
    </ItemColumn>
    <ItemColumn style={{ width: '55%' }}>
      <SecondaryText>{description}</SecondaryText>
    </ItemColumn>
    <ItemColumn>
      <Time>{date}</Time>
      <Time>{time}</Time>
    </ItemColumn>
  </TxItemSkeleton>
}

const TxItem = (props: { tx: ITransaction}) => {
  const { configStore } = useStores()
  const { tx } = props
  const { transactionType, eastAmountDiff, westAmountDiff, callTimestamp, params, callTxId, requestTxId } = tx
  const date = moment(callTimestamp).format('MMMM D')
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

export const TransactionsHistory = (props: IProps) => {
  const { api, authStore } = useStores()
  const { address } = authStore
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [txStatuses, setTxStatuses] = useState<TxCallStatus[]>([])
  const [inProgress, setInProgress] = useState(false)

  const startCheckTxs = async (txs: ITransaction[], statuses: TxCallStatus[]) => {
    try {
      const txsHistory = await api.getTransactionsHistory(address)
      const newTransactions = [...txs]
      let newStatuses = [...statuses]
      for(let i = 0; i < txsHistory.length; i++) {
        const tx = txsHistory[i]
        const statusMatched = statuses.find(status => status.tx_id === tx.callTxId)
        if (statusMatched) {
          newStatuses = newStatuses.filter(status => status.tx_id !== tx.callTxId)
          newTransactions.unshift(tx)
        }
      }

      setTransactions(newTransactions)
      setTxStatuses(newStatuses)

      if (newStatuses.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000))
        startCheckTxs(newTransactions, newStatuses)
      }
    } catch (e) {
      console.log('Error on compare txs and statuses', e.message)
    }
  }

  useEffect(() => {
    const loadTxs = async () => {
      try {
        setInProgress(true)
        const txs = await api.getTransactionsHistory(address)
        setTransactions(txs)

        let statuses = await api.getTransactionsStatuses(address)
        statuses = statuses.filter(item => item.status !== ContractExecutionStatus.success)
        setTxStatuses(statuses)
        if (statuses.length > 0) {
          startCheckTxs(txs, statuses)
        }
      } catch(e) {
        console.error('Load txs error:', e.message)
      } finally {
        setInProgress(false)
      }
    }
    loadTxs()
  }, [])

  return <PrimaryModalContainer {...props} style={{ padding: '24px 24px 4px', overflow: 'hidden' }}>
    <PrimaryTitle>Transaction history</PrimaryTitle>
    <ItemsContainer>
      {inProgress &&
        Array(5).fill(null).map((_, index) => <TxItemSkeleton key={index} />)
      }
      {(!inProgress && txStatuses.length > 0) &&
        txStatuses.map((txStatus, index) => <TxStatus key={index} tx={txStatus} />)
      }
      {(!inProgress && transactions.length > 0) &&
        transactions.map((tx, index) => <TxItem key={index} tx={tx} />)
      }
    </ItemsContainer>
  </PrimaryModalContainer>
}
