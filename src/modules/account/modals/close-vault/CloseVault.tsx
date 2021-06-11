import React, { useState } from 'react'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { CloseVaultInfo } from './Info'
import { CloseVaultConfirmation } from './Confirmation'
import useStores from '../../../../hooks/useStores'

interface IProps {
  onClose: () => void
}

enum Steps {
  info = 0,
  confirmation = 1
}

export const CloseVault = (props: IProps) => {
  const [currentStep, setCurrentStep] = useState(Steps.info)

  const modalStatus = currentStep === Steps.info ? ModalStatus.success : ModalStatus.warning
  const title = currentStep === Steps.info ? 'close vault' : 'are you sure?'
  const content = currentStep === Steps.info
    ? <CloseVaultInfo onNextClicked={() => setCurrentStep(Steps.confirmation)} />
    : <CloseVaultConfirmation onPrevClicked={() => setCurrentStep(Steps.info)} />

  return <PrimaryModal {...props} status={modalStatus}>
    <PrimaryTitle>{title}</PrimaryTitle>
    {content}
  </PrimaryModal>
}
