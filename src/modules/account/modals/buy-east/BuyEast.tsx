import React, { useState } from 'react'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { CheckForm } from './CheckForm'
import { Steps } from './constants'
import { FillForm, FillFormData } from './FillForm'
import useStores from '../../../../hooks/useStores'

interface IProps {
  onClose: () => void
}

export const BuyEast = (props: IProps) => {
  const westPrice = 0.3638
  const { configStore } = useStores()
  const [currentStep, setCurrentStep] = useState(Steps.fill)
  const [eastAmount, setEastAmount] = useState('')
  const [westAmount, setWestAmount] = useState('')

  const sendAtomic = async () => {
    const state = await window.WEWallet.publicState()
    console.log('WALLET state', state)
    const { account: { address, publicKey } } = state
    const ownerAddress = configStore.getEastOwnerAddress()
    const eastContractId = configStore.getEastContractId()
    const transfer = {
      type: 'transferV3',
      tx: {
        recipient: ownerAddress,
        assetId: 'WAVES',
        amount: +westAmount * Math.pow(10, 8),
        fee: '1000000',
        attachment: '',
        timestamp: Date.now(),
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transferId = await window.WEWallet.getTxId({ type: 'transferV3', tx: transfer.tx })
    console.log('transferId:', transferId)
    const dockerCall = {
      type: 'dockerCallV4',
      tx: {
        senderPublicKey: publicKey,
        authorPublicKey: publicKey,
        contractId: eastContractId,
        contractVersion: 1,
        timestamp: Date.now(),
        params: [{
          type: 'string',
          key: 'mint',
          value: JSON.stringify({
            transferId: transferId
          })
        }],
        fee: '1000000',
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transactions = [transfer, dockerCall]
    // const signedTx = await window.WEWallet.signAtomicTransaction({ transactions, fee: '0' })
    // console.log('signedTx', signedTx)
    const result = await window.WEWallet.broadcastAtomic(transactions)
    console.log('broadcast result', result)
  }

  let content = null
  const formProps = {
    eastAmount,
    westAmount,
    westPrice,
  }
  if (currentStep === Steps.fill) {
    const onNextClicked = (data: FillFormData) => {
      setEastAmount(data.eastAmount)
      setWestAmount(data.westAmount)
      setCurrentStep(Steps.check)
    }
    content = <FillForm {...formProps} onNextClicked={onNextClicked} />
  } else if (currentStep === Steps.check) {
    // const onNextClicked = () => setCurrentStep(Steps.selectExchange)
    const onNextClicked = async () => {
      try {
        await sendAtomic()
      } catch (e) {
        console.error('sendAtomic Error:', e)
      }
    }
    const onPrevClicked = () => setCurrentStep(Steps.fill)
    content = <CheckForm {...formProps} onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} />
  }

  return <PrimaryModal {...props}>
    <PrimaryTitle>Convert WEST into EAST</PrimaryTitle>
    <div>{content}</div>
  </PrimaryModal>
}
