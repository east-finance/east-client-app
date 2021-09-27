import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { ContractExecutionStatus, ITransaction, TxCallStatus } from '../../../../interfaces'
import useStores from '../../../../hooks/useStores'
import { TxItemSkeleton, TxItem, TxStatus } from './TxRows'
import moment from 'moment'

function instanceOfITransaction(object: any): object is ITransaction {
  return 'callTxId' in object
}

function instanceOfTxCallStatus(object: any): object is TxCallStatus {
  return 'tx_id' in object
}

const PrimaryModalContainer = styled(PrimaryModal)`
`

const ItemsContainer = styled.div`
  margin-top: 32px;
  max-height: min(380px, 60vh);
  height: min(380px, 60vh);
  overflow-y: scroll;
`

const HistoryMessage = styled.div`
  text-align: center;
  font-size: 24px;
`

interface IProps {
  onClose: () => void
}

const sleep = (timeout = 5000) => new Promise(resolve => setTimeout(resolve, timeout))

const mergeTxsWithStatuses = (txs: ITransaction[], statuses: TxCallStatus[]) => {
  const mergedTxs = [...txs, ...statuses]
  return mergedTxs.sort((a: ITransaction | TxCallStatus, b: ITransaction | TxCallStatus) => {
    const aTimestamp = instanceOfITransaction(a) ? a.callTimestamp : a.timestamp
    const bTimestamp = instanceOfITransaction(b) ? b.callTimestamp : b.timestamp
    const delta = moment(aTimestamp).valueOf() - moment(bTimestamp).valueOf()
    if (delta > 0) {
      return -1
    } else if (delta < 0) {
      return 1
    }
    return 0
  })
}

const mergeUniqueTxsWithStatuses = (txs: ITransaction[], statuses: TxCallStatus[]) => {
  const newTxs = [...txs]
  let newStatuses = [...statuses]
  for(let i = 0; i < txs.length; i++) {
    const tx = txs[i]
    const statusMatched = statuses.find(status => status.tx_id === tx.callTxId)
    if (statusMatched) {
      newStatuses = newStatuses.filter(status => status.tx_id !== tx.callTxId)
      newTxs.unshift(tx)
    }
  }
  return {
    txs: newTxs,
    statuses: newStatuses
  }
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
        await sleep(5000)
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
        const txsLoaded = await api.getTransactionsHistory(address)
        let statusesLoaded = await api.getTransactionsStatuses(address)
        statusesLoaded = statusesLoaded.filter(item => {
          const isStatusTxMined = txsLoaded.find(tx => tx.callTxId === item.tx_id)
          if (!isStatusTxMined) {
            return true
          }
          return item.status !== ContractExecutionStatus.success
        })
        const { txs, statuses } = mergeUniqueTxsWithStatuses(txsLoaded, statusesLoaded)
        setTransactions(txs)
        setTxStatuses(statuses)
        if (statuses.length > 0) {
          sleep(5000).then(() => {
            startCheckTxs(txs, statuses)
          })
        }
      } catch(e) {
        console.error('Load txs error:', e.message)
      } finally {
        setInProgress(false)
      }
    }
    loadTxs()
  }, [])

  const mergedTxs = mergeTxsWithStatuses(transactions, txStatuses)

  const emptyHistory = <HistoryMessage>
    History is empty
  </HistoryMessage>

  return <PrimaryModalContainer {...props} id={'txs-history-modal'} style={{ padding: '24px 24px 4px', overflow: 'hidden' }}>
    <PrimaryTitle>Transaction history</PrimaryTitle>
    <ItemsContainer>
      {inProgress &&
        Array(5).fill(null).map((_, index) => <TxItemSkeleton key={index} />)
      }
      {!inProgress &&
        mergedTxs.map((tx, index) => {
          if (instanceOfITransaction(tx)) {
            return <TxItem key={index} tx={tx} />
          } else if(instanceOfTxCallStatus(tx)) {
            return <TxStatus key={index} tx={tx} />
          }
        })}
      {(!inProgress && mergedTxs && mergedTxs.length === 0) &&
        emptyHistory
      }
    </ItemsContainer>
  </PrimaryModalContainer>
}
