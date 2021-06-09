import React, { useState } from 'react'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { Steps } from '../../../../components/Steps'
import { Block } from '../../../../components/Block'
import { SupplyCollateral } from './SupplyCollateral'
import styled from 'styled-components'

interface IProps {
  onClose: () => void
}

enum IssueSteps {
  SupplyCollateral = 0,
  IssueEast = 1,
  ConfirmTransaction = 2
}

const Centered = styled.div`
  display: flex;
  justify-content: center;
`

export const AddEast = (props: IProps) => {
  const [stepIndex, setStepIndex] = useState(IssueSteps.SupplyCollateral)

  const content = <SupplyCollateral westAmount={'400'} onSuccess={() => { console.log('123') }} />
  const modalStatus = ModalStatus.warning

  return <PrimaryModal {...props} status={modalStatus}>
    <PrimaryTitle>issue east stablecoin</PrimaryTitle>
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
    {content}
  </PrimaryModal>
}
