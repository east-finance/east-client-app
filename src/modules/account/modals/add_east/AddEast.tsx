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
import { ConfirmIssueTransaction } from './ConfirmIssueTransaction'
import { TxSendSuccess } from '../../common/TxSendSuccess'

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
  const { vaultCollateral, supplyVaultWestAmount } = dataStore
  const initialStep = vaultCollateral < configStore.getWestCollateral()
    ? IssueSteps.SupplyCollateral
    : IssueSteps.FillForm
  const [refillWestAmount, setRefillWestAmount] = useState('')
  const [stepIndex, setStepIndex] = useState(initialStep)
  const [formData, setFormData] = useState({ eastAmount: '', westAmount: '' })
  const totalFee = +configStore.getFeeByOpType(EastOpType.supply)

  let content = <div />
  let modalStatus = ModalStatus.success
  if (refillWestAmount) {
    modalStatus = ModalStatus.warning
    const onPrevClicked = () => {
      setRefillWestAmount('')
      setStepIndex(IssueSteps.FillForm)
    }
    content = <Block marginTop={64}>
      <AddWestToAddress
        westAmount={Math.ceil(+refillWestAmount).toString()}
        eastAmount={formData.eastAmount}
        onPrevClicked={onPrevClicked}
      />
    </Block>
  } else if (stepIndex === IssueSteps.SupplyCollateral) {
    modalStatus = ModalStatus.warning
    const onSuccess = () => {
      setStepIndex(IssueSteps.FillForm)
    }
    content = <SupplyCollateral
      vaultCollateral={vaultCollateral}
      westAmount={Math.ceil(supplyVaultWestAmount)}
      onSuccess={onSuccess}
    />
  } else if (stepIndex === IssueSteps.FillForm) {
    const onNextClicked = (formData: FillFormData) => {
      setFormData(formData)
      setStepIndex(IssueSteps.ConfirmTransaction)
      const westDelta = (+formData.westAmount + totalFee) - +dataStore.westBalance
      if (westDelta > 0) {
        setRefillWestAmount(westDelta.toString())
      }
    }
    content = <FillIssueForm
      eastAmount={formData.eastAmount}
      westAmount={formData.westAmount}
      onNextClicked={onNextClicked}
    />
  } else if(stepIndex === IssueSteps.ConfirmTransaction) {
    content = <ConfirmIssueTransaction
      eastAmount={formData.eastAmount}
      westAmount={formData.westAmount}
      onNextClicked={() => setStepIndex(IssueSteps.Success)}
      onPrevClicked={() => setStepIndex(IssueSteps.FillForm)}
    />
  } else if(stepIndex === IssueSteps.Success) {
    content = <TxSendSuccess
      text={'You will receive your EAST after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  }

  return <PrimaryModal {...props} status={modalStatus}>
    <PrimaryTitle>issue east stablecoin</PrimaryTitle>
    <div>
      {(!refillWestAmount && stepIndex !== IssueSteps.Success) &&
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
