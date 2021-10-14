import React, { useState } from 'react'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { TxSendSuccess } from '../../common/TxSendSuccess'
import { FillFormData, FillSupplyForm } from './FillSupplyForm'
import { SupplyConfirmation } from './SupplyConfirmation'
import { AddWestToAddress } from '../../common/AddWestToAddress'
import useStores from '../../../../hooks/useStores'
import { Block } from '../../../../components/Block'
import { EastOpType } from '../../../../interfaces'

interface IProps {
  onClose: () => void
}

enum SupplyVaultSteps {
  fill = 'fill',
  addWest = 'addWest',
  confirmation = 'confirmation',
  success = 'success'
}

export const SupplyVault = (props: IProps) => {
  const { dataStore } = useStores()
  const [currentStep, setCurrentStep] = useState(SupplyVaultSteps.fill)
  const [formData, setFormData] = useState({ westAmount: '' })

  const changeStep = (step: SupplyVaultSteps) => {
    setCurrentStep(step)
    dataStore.heapTrack(`${EastOpType.supply}_changeStep_${step}`)
  }

  let content = null
  if(currentStep === SupplyVaultSteps.fill) {
    const onNextClicked = (formData: FillFormData) => {
      setFormData(formData)
      const rechargeWestAmount = Math.ceil(+formData.westAmount - +dataStore.westBalance)
      if (rechargeWestAmount > 0) {
        changeStep(SupplyVaultSteps.addWest)
      } else {
        changeStep(SupplyVaultSteps.confirmation)
      }
    }
    content = <FillSupplyForm westAmount={formData.westAmount} onNextClicked={onNextClicked} />
  } else if(currentStep === SupplyVaultSteps.addWest) {
    const rechargeWestAmount = Math.ceil(+formData.westAmount - +dataStore.westBalance).toString()
    content = <AddWestToAddress westAmount={rechargeWestAmount} onPrevClicked={() => changeStep(SupplyVaultSteps.fill)} />
  } else if (currentStep === SupplyVaultSteps.confirmation) {
    content =  <Block marginTop={32}>
      <SupplyConfirmation
        westAmount={formData.westAmount}
        onPrevClicked={() => changeStep(SupplyVaultSteps.fill)}
        onSuccess={() => changeStep(SupplyVaultSteps.success)}
      />
    </Block>
  } else {
    content = <TxSendSuccess
      closeAttr={'supply-3_close'}
      text={'Vault will be supplied by WEST after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  }

  return <PrimaryModal {...props} status={ModalStatus.success} id={'supply-modal'}>
    <PrimaryTitle>Add WEST to the vault</PrimaryTitle>
    {content}
  </PrimaryModal>
}
