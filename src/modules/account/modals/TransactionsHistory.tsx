import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block } from '../../../components/Block'
import { GradientText } from '../../../components/Text'
import { EastOpType, ITransaction } from '../../../interfaces'
import useStores from '../../../hooks/useStores'
import { shineBatch } from '../../../components/Animations'
import { roundNumber } from '../../../utils'

interface IProps {
  onClose: () => void
}

const ItemColumn = styled.div`
  text-align: left;
`

const ItemsContainer = styled.div`
  margin-top: 32px;
  max-height: 380px;
  height: 380px;
  overflow-y: scroll;
`

const ItemContainer = styled.div`
  display: flex;
  height: 76px;
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

const LinkWrapper = styled.div`
  background: rgba(224, 224, 224, 0.25);
  border-radius: 8px;
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
  line-break: anywhere;
`

const SecondaryText = styled.div`
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #000000;
`

const Time = styled.div`
  font-size: 15px;
  line-height: 24px;
  color: ${props => props.theme.darkBlue50};
`

const TxItem = (props: { tx: ITransaction}) => {
  const { configStore } = useStores()
  const { tx } = props
  const { transactionType, eastAmountDiff, westAmountDiff, callTimestamp, params, callTxId, requestTxId } = tx
  const date = moment(callTimestamp).format('MMM Do')
  const time = moment(callTimestamp).format('hh:mm a')
  const isReceived = +eastAmountDiff > 0
  const isReceivedWest = +westAmountDiff > 0

  let explorerTxId = callTxId

  let eastDiff = roundNumber(eastAmountDiff, 2).toString()
  if (isReceived) {
    eastDiff = '+' + eastDiff
  }
  let westDiff = roundNumber(westAmountDiff, 2).toString()
  if (isReceivedWest) {
    westDiff = '+' + westDiff
  }

  let primaryText = ''
  let description = ''
  if (transactionType === EastOpType.transfer) {
    primaryText = `${eastDiff} EAST`
    description = isReceived ? `Transfer from ${tx.address}` : `Transfer to ${params.to}`
  } else if (transactionType === EastOpType.mint) {
    primaryText = `${eastDiff} EAST`
    description = 'Added to the vault'
  } else if (transactionType === EastOpType.close_init) {
    primaryText = `${eastDiff} EAST`
    description = 'Initialize vault close'
    if (requestTxId) {
      explorerTxId = requestTxId
    }
  } else if (transactionType === EastOpType.close) {
    primaryText = `${eastDiff} EAST`
    description = 'Vault is closed'
  } else if (transactionType === EastOpType.supply) {
    primaryText = `${westDiff} WEST`
    description = 'Supply vault'
  } else if (transactionType === EastOpType.reissue) {
    primaryText = `${westDiff} WEST`
    description = 'Reissue vault'
  } else if (transactionType === EastOpType.claim_overpay) {
    primaryText = `${westDiff} WEST`
    description = 'Claim overpay'
  } else {
    primaryText = `${eastDiff} EAST`
    description = transactionType
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
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [inProgress, setInProgress] = useState(false)

  useEffect(() => {
    const loadTxs = async () => {
      try {
        setInProgress(true)
        const txs = await api.getTransactionsHistory(authStore.address)
        setTransactions(txs)
      } catch(e) {
        console.error('Load txs error:', e.message)
      } finally {
        setInProgress(false)
      }
    }
    loadTxs()
  }, [])

  return <PrimaryModal {...props} style={{ padding: '24px 24px 0', overflow: 'hidden' }}>
    <PrimaryTitle>Transaction history</PrimaryTitle>
    <ItemsContainer>
      {inProgress
        ? Array(1).fill(null).map((_, index) => <TxItemSkeleton key={index} />)
        : transactions.map((tx, index) => <TxItem key={index} tx={tx} />)
      }
    </ItemsContainer>
  </PrimaryModal>
}
