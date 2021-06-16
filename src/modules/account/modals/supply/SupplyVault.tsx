import React, { useState } from 'react'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { TxSendSuccess } from '../../common/TxSendSuccess'
import { FillFormData, FillSupplyForm } from './FillSupplyForm'
import { SupplyConfirmation } from './SupplyConfirmation'

interface IProps {
  onClose: () => void
}

enum SupplyVaultSteps {
  fill = 0,
  confirmation = 1,
  success = 2
}

export const SupplyVault = (props: IProps) => {
  const [currentStep, setCurrentStep] = useState(SupplyVaultSteps.fill)
  const [formData, setFormData] = useState({ westAmount: '' })

  let content = null
  if(currentStep === SupplyVaultSteps.fill) {
    const onNextClicked = (formData: FillFormData) => {
      setFormData(formData)
      setCurrentStep(SupplyVaultSteps.confirmation)
    }
    content = <FillSupplyForm westAmount={formData.westAmount} onNextClicked={onNextClicked} />
  } else if (currentStep === SupplyVaultSteps.confirmation) {
    content =  <SupplyConfirmation
      westAmount={formData.westAmount}
      onPrevClicked={() => setCurrentStep(SupplyVaultSteps.fill)}
      onSuccess={() => setCurrentStep(SupplyVaultSteps.success)}
    />
  } else {
    content = <TxSendSuccess
      text={'Vault will be supplied by WEST after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  }

  return <PrimaryModal {...props} status={ModalStatus.success}>
    <PrimaryTitle>Add WEST to the vault</PrimaryTitle>
    {content}
  </PrimaryModal>
}
