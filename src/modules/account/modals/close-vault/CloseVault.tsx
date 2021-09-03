import React, { useState } from 'react'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { CloseVaultInfo } from './Info'
import { CloseVaultConfirmation } from './Confirmation'
import { TxSendSuccess } from '../../common/TxSendSuccess'

interface IProps {
  onClose: () => void
}

enum Steps {
  info = 0,
  confirmation = 1,
  success = 2
}

export const CloseVault = (props: IProps) => {
  const [currentStep, setCurrentStep] = useState(Steps.info)

  let modalStatus = ModalStatus.success
  let title = 'close vault'
  let content = <CloseVaultInfo onNextClicked={() => setCurrentStep(Steps.confirmation)} />
  if (currentStep === Steps.confirmation) {
    modalStatus = ModalStatus.warning
    title = 'are you sure?'
    content =  <CloseVaultConfirmation onPrevClicked={() => setCurrentStep(Steps.info)} onSuccess={() => setCurrentStep(Steps.success)} />
  } else if (currentStep === Steps.success) {
    content = <TxSendSuccess
      text={'Vault will be closed after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  }

  return <PrimaryModal {...props} status={modalStatus} id={'close-vault-modal'}>
    <PrimaryTitle>{title}</PrimaryTitle>
    {content}
  </PrimaryModal>
}
