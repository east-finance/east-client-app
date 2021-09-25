import React, { useEffect, useState } from 'react'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { CheckForm } from './CheckForm'
import { Steps } from './constants'
import { FillForm, FillFormData } from './FillForm'
import useStores from '../../../../hooks/useStores'
import { RechargeWest } from './RechargeWest'
import { BuyWestSuccess } from './Success'
import { TxTextType } from '../../../../interfaces'
import { observer } from 'mobx-react'

interface IProps {
  onClose: () => void
}

export const BuyEast = observer((props: IProps) => {
  const { configStore, dataStore, authStore, signStore } = useStores()
  const [currentStep, setCurrentStep] = useState(Steps.fill)
  const [eastAmount, setEastAmount] = useState('')
  const [westAmount, setWestAmount] = useState('')
  const [westBalance, setWestBalance] = useState('0')
  const [inProgress, setInProgress] = useState(false)

  const sendAtomic = async () => {
    const { address, publicKey } = await signStore.getPublicData()
    const ownerAddress = configStore.getEastServiceAddress()
    const eastContractId = configStore.getEastContractId()

    const transferBody = {
      recipient: ownerAddress,
      amount: Math.round(+westAmount * Math.pow(10, 8)),
      fee: configStore.getTransferFee(),
      attachment: '',
      timestamp: Date.now(),
      atomicBadge: {
        trustedSender: address
      }
    }
    const transfer = {
      type: TxTextType.transferV3,
      tx: transferBody
    }

    const transferId = await signStore.getTransferId(transferBody)

    const dockerCall = {
      type: TxTextType.dockerCallV4,
      tx: {
        senderPublicKey: publicKey,
        authorPublicKey: publicKey,
        contractId: eastContractId,
        contractVersion: configStore.getEastContractVersion(),
        timestamp: Date.now(),
        params: [{
          type: 'string',
          key: 'mint',
          value: JSON.stringify({
            transferId: transferId
          })
        }],
        fee: configStore.getDockerCallFee(),
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transactions = [transfer, dockerCall]
    const result = await signStore.broadcastAtomic(transactions)
    console.log('Broadcast MINT atomic result:', result)
  }

  let content = null
  let modalStatus = ModalStatus.success
  const formProps = {
    eastAmount,
    westAmount,
    westRate: dataStore.westRate,
    usdapRate: dataStore.usdapRate,
    inProgress
  }
  if (currentStep === Steps.fill) {
    // const onNextClicked = (data: FillFormData) => {
    //   setEastAmount(data.eastAmount)
    //   setWestAmount(data.westAmount)
    //   setCurrentStep(Steps.check)
    // }
    const onNextClicked = async (data: FillFormData) => {
      try {
        setInProgress(true)
        setEastAmount(data.eastAmount)
        setWestAmount(data.westAmount)
        const westBalance = await dataStore.getWestBalance(authStore.address)
        setWestBalance(westBalance)
        if (+data.westAmount > +westBalance) {
          setCurrentStep(Steps.rechargeWest)
        } else {
          setCurrentStep(Steps.check)
        }
      } catch (e) {
        console.error('sendAtomic Error:', e)
      } finally {
        setInProgress(false)
      }
    }
    content = <FillForm {...formProps} onNextClicked={onNextClicked} />
  } else if (currentStep === Steps.check) {
    // const onNextClicked = () => setCurrentStep(Steps.selectExchange)
    const onNextClicked = async () => {
      try {
        setInProgress(true)
        const westBalance = await dataStore.getWestBalance(authStore.address)
        setWestBalance(westBalance)
        if (+westAmount > +westBalance) {
          setCurrentStep(Steps.rechargeWest)
        } else {
          await sendAtomic()
          setCurrentStep(Steps.success)
        }
      } catch (e) {
        console.error('sendAtomic Error:', e)
      } finally {
        setInProgress(false)
      }
    }
    const onPrevClicked = () => setCurrentStep(Steps.fill)
    content = <CheckForm {...formProps} onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} />
  } else if (currentStep === Steps.rechargeWest) {
    const onPrevClicked = () => setCurrentStep(Steps.fill)
    const rechargeWestAmount = (+westAmount - +westBalance).toString()
    content = <RechargeWest rechargeWestAmount={rechargeWestAmount} eastAmount={eastAmount} westAmount={westAmount} onPrevClicked={onPrevClicked} />
    modalStatus = ModalStatus.warning
  } else if (currentStep === Steps.success) {
    content = <BuyWestSuccess onClose={props.onClose} />
  }

  return <PrimaryModal {...props} status={modalStatus} id={'mint-modal'}>
    <PrimaryTitle>mint east stablecoin</PrimaryTitle>
    <div>{content}</div>
  </PrimaryModal>
})
