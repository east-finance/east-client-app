import React, { useState } from 'react'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { Steps } from '../../../../components/Steps'
import { Block } from '../../../../components/Block'
import { SupplyCollateral } from './SupplyCollateral'
import styled from 'styled-components'
import { FillFormData, FillIssueForm } from './FillIssueForm'
import { observer } from 'mobx-react'
import useStores from '../../../../hooks/useStores'
import { EastOpType } from '../../../../interfaces'
import { AddWestToAddress } from '../../common/AddWestToAddress'

interface IProps {
  onClose: () => void
}

enum IssueSteps {
  SupplyCollateral = 0,
  FillForm = 1,
  ConfirmTransaction = 2,
  Success = 3
}

const Centered = styled.div`
  display: flex;
  justify-content: center;
`

export const AddEast = observer((props: IProps) => {
  const { dataStore, configStore } = useStores()
  const [refillWestAmount, setRefillWestAmount] = useState('')
  const [stepIndex, setStepIndex] = useState(IssueSteps.SupplyCollateral)
  const [formData, setFormData] = useState({ eastAmount: '', westAmount: '' })
  const fee = +configStore.getFeeByOpType(EastOpType.supply)

  let content = <div />
  let modalStatus = ModalStatus.warning
  if (refillWestAmount) {
    const onPrevClicked = () => {
      setRefillWestAmount('')
      setStepIndex(IssueSteps.FillForm)
    }
    content = <Block marginTop={64}>
      <AddWestToAddress westAmount={Math.ceil(+refillWestAmount).toString()} eastAmount={formData.eastAmount} onPrevClicked={onPrevClicked} />
    </Block>
  } else if (stepIndex === IssueSteps.SupplyCollateral) {
    const onSuccess = () => {
      setStepIndex(IssueSteps.FillForm)
    }
    content = <SupplyCollateral westAmount={'400'} onSuccess={onSuccess} />
  } else if (stepIndex === IssueSteps.FillForm) {
    modalStatus = ModalStatus.success
    const onNextClicked = (formData: FillFormData) => {
      setFormData(formData)
      setStepIndex(IssueSteps.ConfirmTransaction)
      const westDelta = (+formData.westAmount + fee) - +dataStore.westBalance
      if (westDelta > 0) {
        setRefillWestAmount(westDelta.toString())
      }
    }
    content = <FillIssueForm
      eastAmount={formData.eastAmount}
      westAmount={formData.westAmount}
      onNextClicked={onNextClicked}
    />
  }

  return <PrimaryModal {...props} status={modalStatus}>
    <PrimaryTitle>issue east stablecoin</PrimaryTitle>
    <div>
      {!refillWestAmount &&
        <Block marginTop={40}>
          <Centered>
            <Steps steps={[{
              text: '1. Supply collateral'
            }, {
              text: '2. Issue EAST'
            }, {
              text: '3. Confirm transaction'
            }]} currentStepIndex={stepIndex} />
          </Centered>
        </Block>
      }
    </div>
    {content}
  </PrimaryModal>
})
