import React from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block } from '../../../components/Block'
import { GradientText } from '../../../components/Text'
import { ITransaction, TransactionType } from '../../../interfaces'

interface IProps {
  onClose: () => void
}

const ItemColumn = styled.div``

const ItemsContainer = styled.div`
  margin-top: 32px;
  max-height: 430px;
  overflow-y: scroll;
`

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(180deg, #F2F2F2 0%, #EDEDED 100%);
  border-radius: 4px;
  margin-bottom: 8px;
  
  :last-child {
    margin-bottom: 24px;
  }
`

const LinkWrapper = styled.div`
  background: rgba(224, 224, 224, 0.25);
  border-radius: 8px;
`

const ExplorerLink = styled(GradientText)`
  font-family: Cairo;
  font-size: 15px;
  line-height: 18px;
  padding: 8px 16px;
  cursor: pointer;
`

const PrimaryText = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 16px;
`

const SecondaryText = styled.div`
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #000000;
`

const Item = (props: { tx: ITransaction}) => {
  const { tx } = props
  return <ItemContainer>
    <ItemColumn>
      <PrimaryText>+500 EAST</PrimaryText>
      <Block marginTop={8}>
        <SecondaryText>20.05.2020 21:15</SecondaryText>
      </Block>
    </ItemColumn>
    <ItemColumn>
      <SecondaryText>Added to the vault</SecondaryText>
    </ItemColumn>
    <ItemColumn>
      <LinkWrapper>
        <ExplorerLink>In explorer</ExplorerLink>
      </LinkWrapper>
    </ItemColumn>
  </ItemContainer>
}

export const TransactionsHistory = (props: IProps) => {
  const transactions: ITransaction[] = [{
    transactionType: TransactionType.transfer,
    callTxId: '9',
    callTimestamp: '2021-05-24T07:48:01.628Z',
    info: {
      eastAmount: 500
    }
  }, {
    transactionType: TransactionType.transfer,
    callTxId: '8',
    callTimestamp: '2021-05-24T07:48:01.628Z',
    info: {
      eastAmount: 500
    }
  }, {
    transactionType: TransactionType.transfer,
    callTxId: '7',
    callTimestamp: '2021-05-24T07:48:01.628Z',
    info: {
      eastAmount: 500
    }
  }, {
    transactionType: TransactionType.transfer,
    callTxId: '6',
    callTimestamp: '2021-05-24T07:48:01.628Z',
    info: {
      eastAmount: 500
    }
  }, {
    transactionType: TransactionType.transfer,
    callTxId: '5',
    callTimestamp: '2021-05-24T07:48:01.628Z',
    info: {
      eastAmount: 500
    }
  }, {
    transactionType: TransactionType.transfer,
    callTxId: '4',
    callTimestamp: '2021-05-24T07:48:01.628Z',
    info: {
      eastAmount: 500
    }
  }, {
    transactionType: TransactionType.transfer,
    callTxId: '3',
    callTimestamp: '2021-05-24T07:48:01.628Z',
    info: {
      eastAmount: 500
    }
  }, {
    transactionType: TransactionType.transfer,
    callTxId: '2',
    callTimestamp: '2021-05-24T07:48:01.628Z',
    info: {
      eastAmount: 500
    }
  }, {
    transactionType: TransactionType.mint,
    callTxId: '1',
    callTimestamp: '2021-05-21T12:41:42.708Z',
    info: {
      eastAmount: 260.24,
      usdpAmount: 70,
      westAmount: 130
    }
  }]

  return <PrimaryModal {...props} style={{ padding: '24px 24px 0', overflow: 'hidden' }}>
    <PrimaryTitle>Transaction history</PrimaryTitle>
    <ItemsContainer>
      {transactions.map((tx) => <Item key={tx.callTxId} tx={tx} />)}
    </ItemsContainer>
  </PrimaryModal>
}
