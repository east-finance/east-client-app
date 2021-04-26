import React, { useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { CheckForm } from './CheckForm'
import { Steps } from './constants'
import { FillForm, FillFormData } from './FillForm'

interface IProps {
  onClose: () => void
}

export const BuyEast = (props: IProps) => {
  const eastToWest = 2
  const [currentStep, setCurrentStep] = useState(Steps.fill)
  const [eastAmount, setEastAmount] = useState('')
  const [westAmount, setWestAmount] = useState('')

  let content = null
  const formProps = {
    eastAmount,
    westAmount,
    eastToWest,
  }
  if (currentStep === Steps.fill) {
    const onNextClicked = (data: FillFormData) => {
      setEastAmount(data.eastAmount)
      setWestAmount(data.westAmount)
      setCurrentStep(Steps.check)
    }
    content = <FillForm {...formProps} onNextClicked={onNextClicked} />
  } else if (currentStep === Steps.check) {
    const onNextClicked = () => setCurrentStep(Steps.selectExchange)
    const onPrevClicked = () => setCurrentStep(Steps.fill)
    content = <CheckForm {...formProps} onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} />
  }

  return <PrimaryModal {...props}>
    <PrimaryTitle>Convert WEST into EAST</PrimaryTitle>
    <div>{content}</div>
  </PrimaryModal>
}
