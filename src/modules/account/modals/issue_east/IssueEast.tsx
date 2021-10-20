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
import { useRoute } from 'react-router5'
import { roundNumber } from '../../../../utils'
import { isDesktop } from 'react-device-detect'

interface IProps {
  onClose: () => void
}

export enum IssueSteps {
  SupplyCollateral = 'SupplyCollateral',
  FillForm = 'FillForm',
  ConfirmTransaction = 'ConfirmTransaction',
  Success = 'Success'
}

const Centered = styled.div`
  display: flex;
  justify-content: center;
`

export const IssueEast = observer((props: IProps) => {
  const { dataStore, configStore } = useStores()
  const { route: { params } } = useRoute()
  const { vaultCollateral, supplyVaultWestDiff } = dataStore
  let initialStep = +supplyVaultWestDiff > 0
    ? IssueSteps.SupplyCollateral
    : IssueSteps.FillForm
  if (params.step) {
    initialStep = params.step
  }
  const [refillWestAmount, setRefillWestAmount] = useState('')
  const [stepIndex, setStepIndex] = useState(initialStep)
  const [formData, setFormData] = useState({ eastAmount: params.eastAmount || '', westAmount: params.westAmount || '' })
  const totalFee = +configStore.getFeeByOpType(EastOpType.supply)

  const changeStep = (step: IssueSteps) => {
    setStepIndex(step)
    dataStore.heapTrack(`issue_changeStep_${step}`, formData)
  }

  let content = <div />
  let modalStatus = ModalStatus.success
  if (refillWestAmount) {
    modalStatus = ModalStatus.warning
    const onPrevClicked = () => {
      setRefillWestAmount('')
      changeStep(IssueSteps.FillForm)
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
      changeStep(IssueSteps.FillForm)
    }
    content = <SupplyCollateral
      vaultCollateral={vaultCollateral}
      westAmount={supplyVaultWestDiff}
      onSuccess={onSuccess}
    />
  } else if (stepIndex === IssueSteps.FillForm) {
    const onNextClicked = (formData: FillFormData) => {
      setFormData(formData)
      changeStep(IssueSteps.ConfirmTransaction)
      const addWestAmount = roundNumber((+formData.westAmount + totalFee + supplyVaultWestDiff), 8)
      const westDelta = roundNumber(addWestAmount - +dataStore.westBalance, 8)
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
      onNextClicked={() => changeStep(IssueSteps.Success)}
      onPrevClicked={() => changeStep(IssueSteps.FillForm)}
    />
  } else if(stepIndex === IssueSteps.Success) {
    content = <TxSendSuccess
      data-attr={'issueEast-3_close'}
      text={'You will receive your EAST after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  }

  return <PrimaryModal {...props} status={modalStatus} id={'issue-modal'}>
    <PrimaryTitle>issue east stablecoin</PrimaryTitle>
    <div>
      {(isDesktop && !refillWestAmount && stepIndex !== IssueSteps.Success) &&
        <Block marginTop={40}>
          <Centered>
            <Steps steps={[{
              text: '1. Supply collateral'
            }, {
              text: '2. Issue EAST'
            }, {
              text: '3. Confirm transaction'
            }]} currentStepIndex={Object.values(IssueSteps).indexOf(stepIndex)} />
          </Centered>
        </Block>
      }
    </div>
    {content}
  </PrimaryModal>
})
