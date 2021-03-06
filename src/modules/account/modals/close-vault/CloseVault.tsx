import React, { useState } from 'react'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { CloseVaultInfo } from './Info'
import { CloseVaultConfirmation } from './Confirmation'
import { TxSendSuccess } from '../../common/TxSendSuccess'
import useStores from '../../../../hooks/useStores'
import { EastOpType } from '../../../../interfaces'
import { AddWestToAddress } from '../../common/AddWestToAddress'

interface IProps {
  onClose: () => void
}

enum Steps {
  info = 'info',
  confirmation = 'confirmation',
  insufficientWest = 'insufficientWest',
  success = 'success'
}

export const CloseVault = (props: IProps) => {
  const { configStore, dataStore, signStore } = useStores()
  const [currentStep, setCurrentStep] = useState(Steps.info)
  const [inProgress, setInProgress] = useState(false)

  const changeStep = (step: Steps) => {
    setCurrentStep(step)
    dataStore.heapTrack(`${EastOpType.close}_changeStep_${step}`)
  }

  const closeInitFee = +configStore.getCloseTotalFee()

  const sendCloseVault = async () => {
    const { publicKey } = await signStore.getPublicData()
    const closeTx = {
      senderPublicKey: publicKey,
      authorPublicKey: publicKey,
      contractId: configStore.getEastContractId(),
      contractVersion: configStore.getEastContractVersion(),
      timestamp: Date.now(),
      params: [{
        type: 'string',
        key: 'close_init',
        value: ''
      }],
      fee: configStore.getDockerCallFee(),
    }
    console.log('Close vault Docker call tx:', closeTx)
    const result = await signStore.broadcastDockerCall(closeTx)
    console.log('Close vault broadcast result:', result)
  }

  const closePosition = async () => {
    try {
      setInProgress(true)
      await sendCloseVault()
      changeStep(Steps.success)
    } catch (e) {
      console.error('Cannot close vault: ', e.message)
    } finally {
      setInProgress(false)
    }
  }

  let modalStatus = ModalStatus.success
  let title = 'close vault'
  let content = <CloseVaultInfo onNextClicked={() => changeStep(Steps.confirmation)} />
  if (currentStep === Steps.confirmation) {
    modalStatus = ModalStatus.warning
    title = 'are you sure?'
    const onSuccess = async () => {
      if (+dataStore.westBalance >= +closeInitFee) {
        await closePosition()
      } else {
        changeStep(Steps.insufficientWest)
      }
    }
    content = <CloseVaultConfirmation inProgress={inProgress} onPrevClicked={() => changeStep(Steps.info)} onSuccess={onSuccess} />
  } else if(currentStep === Steps.insufficientWest) {
    content = <AddWestToAddress
      westAmount={configStore.getFeeByOpType(EastOpType.close_init)}
      eastAmount={''}
      onPrevClicked={() => changeStep(Steps.confirmation)}
    />
  } else if (currentStep === Steps.success) {
    content = <TxSendSuccess
      data-attr={'closeVault-3_close'}
      text={'Vault will be closed after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  }

  return <PrimaryModal {...props} status={modalStatus} id={'close-vault-modal'}>
    <PrimaryTitle>{title}</PrimaryTitle>
    {content}
  </PrimaryModal>
}
