import React, { useState } from 'react'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { TxSendSuccess } from '../../common/TxSendSuccess'
import { FillFormData, FillSupplyForm } from './FillSupplyForm'
import { SupplyConfirmation } from './SupplyConfirmation'
import { AddWestToAddress } from '../../common/AddWestToAddress'
import useStores from '../../../../hooks/useStores'
import { Block } from '../../../../components/Block'

interface IProps {
  onClose: () => void
}

enum SupplyVaultSteps {
  fill = 0,
  addWest = 1,
  confirmation = 3,
  success = 4
}

export const SupplyVault = (props: IProps) => {
  const { dataStore } = useStores()
  const [currentStep, setCurrentStep] = useState(SupplyVaultSteps.fill)
  const [formData, setFormData] = useState({ westAmount: '' })

  let content = null
  if(currentStep === SupplyVaultSteps.fill) {
    const onNextClicked = (formData: FillFormData) => {
      setFormData(formData)
      const rechargeWestAmount = Math.ceil(+formData.westAmount - dataStore.westBalance)
      if (rechargeWestAmount > 0) {
        setCurrentStep(SupplyVaultSteps.addWest)
      } else {
        setCurrentStep(SupplyVaultSteps.confirmation)
      }
    }
    content = <FillSupplyForm westAmount={formData.westAmount} onNextClicked={onNextClicked} />
  } else if(currentStep === SupplyVaultSteps.addWest) {
    const rechargeWestAmount = Math.ceil(+formData.westAmount - dataStore.westBalance).toString()
    content = <AddWestToAddress westAmount={rechargeWestAmount} onPrevClicked={() => setCurrentStep(SupplyVaultSteps.fill)} />
  } else if (currentStep === SupplyVaultSteps.confirmation) {
    content =  <Block marginTop={32}>
      <SupplyConfirmation
        westAmount={formData.westAmount}
        onPrevClicked={() => setCurrentStep(SupplyVaultSteps.fill)}
        onSuccess={() => setCurrentStep(SupplyVaultSteps.success)}
      />
    </Block>
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
