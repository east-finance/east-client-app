import { ContractExecutionStatus, EastOpType, ITransaction } from '../interfaces'
import { Api } from '../api'

export class AbortWatcherError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AbortError'
  }
}

const sleep = (timeout = 5000) => new Promise(resolve => setTimeout(resolve, timeout))

const waitForServiceReceiveTx = async (api: Api, params: IWatchTxParams) => {
  let txReceived = null
  for(let i=0; i < 40; i++) {
    try {
      const txs = await api.getTransactionsHistory(params.address)
      const tx = txs.find(item => [item.requestTxId, item.callTxId].includes(params.id))
      console.log(`Polling tx '${params.id}' (${params.type}) from service history: ${JSON.stringify(tx)}, attempt: ${i}`)
      if(tx) {
        txReceived = tx
        break
      } else {
        await sleep()
      }
    } catch (e) {
      console.error('Error while iterating tx status from Service:', e.message)
      await sleep()
    }
  }
  return txReceived
}

const waitForStatusMined = async ( api: Api, params: IWatchTxParams) => {
  let txStatus = null
  for(let i=0; i < 20; i++) {
    try {
      const statuses = await api.getTransactionsStatuses(params.address, 5)
      const completedTx = statuses.find(item => item.tx_id === params.id && item.status !== ContractExecutionStatus.pending)
      console.log(`Polling tx '${params.id}' (${params.type}) from node status: ${JSON.stringify(completedTx)}, attempt: ${i}`)
      if(completedTx) {
        txStatus = completedTx
        break
      } else {
        await sleep()
      }
    } catch (e) {
      console.error('Error while iterating tx status from Node:', e.message)
      await sleep()
    }
  }
  return txStatus
}

export interface IWatchTxParams {
  address: string
  id: string;
  type: EastOpType;
  onResultReceived: (result: ITransaction | null | AbortWatcherError) => void;
}

export const watchTx = async (abortController: AbortController, api: Api, params: IWatchTxParams) => {
  try {
    const { id } = params

    let isAborted = false

    abortController.signal.addEventListener( 'abort', () => {
      isAborted = true
    })

    const txStatus = await waitForStatusMined(api, params)

    if (isAborted) {
      throw new AbortWatcherError(`Pending tx status ${id} is aborted`)
    }

    if (!txStatus) {
      throw new Error(`Max attempts reached, tx '${id}' is not mined`)
    } else if(txStatus && txStatus.status !== ContractExecutionStatus.success) {
      throw new Error(`Tx '${id}' is not mined successfully: ${JSON.stringify(txStatus)}`)
    } else {
      console.log(`Tx ${id} mined successfully: ${JSON.stringify(txStatus)}`)
    }
    const txReceived = await waitForServiceReceiveTx(api, params)

    if (isAborted) {
      throw new AbortWatcherError(`Pending tx status ${id} is aborted`)
    }

    if (!txReceived) {
      throw new Error(`Max attempts reached, tx  '${id}' was mined, but not received by east service`)
    } else {
      console.log(`Tx ${id} from service: ${JSON.stringify(txReceived)}`)
    }
    params.onResultReceived(txReceived)
  } catch (e) {
    console.error('Tx status watcher error: ', e.message)
    const result = e instanceof AbortWatcherError ? e : null
    params.onResultReceived(result)
  }
}
