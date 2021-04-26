import React, { useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block, Block16, Block24 } from '../../../components/Block'
import { SimpleInput } from '../../../components/Input'
import { Button, NavigationLeftGradientButton } from '../../../components/Button'

interface IProps {
  onClose: () => void
}

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
`

const SubTitle = styled.div`
  color: #0A0606;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
`

const ConfirmTitle = styled.div`
  color: #000000;
  opacity: 0.6;
  font-size: 15px;
`

const SendAmount = styled.div`
  color: #000000;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
`

const SendAddress = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #525252;
`

const SendButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

enum Steps {
  fill = 'fill',
  confirm = 'confirm'
}

export const TransferEast = (props: IProps) => {

  const [eastAmount, setEastAmount] = useState('')
  const [address, setAddress] = useState('')
  const [currentStep, setCurrentStep] = useState(Steps.fill)

  let content = null
  let title = ''

  const onClickContinue = () => {
    setCurrentStep(Steps.confirm)
  }

  if (currentStep === Steps.fill) {
    title = 'transfer east'
    content = <Container>
      <Block marginTop={109}>
        <SimpleInput type={'number'} placeholder={'Amount of EAST'} onChange={(e:  any) => setEastAmount(e.target.value)} />
      </Block>
      <Block24 />
      <SimpleInput placeholder={'Address'} onChange={(e:  any) => setAddress(e.target.value)} />
      <Block marginTop={86}>
        <Button type={'primary'} onClick={onClickContinue}>Continue</Button>
      </Block>
    </Container>
  } else {
    title = 'send east'
    content = <Container>
      <Block16>
        <SubTitle>Confirmation</SubTitle>
      </Block16>
      <Block marginTop={49} style={{ 'textAlign': 'center' }}>
        <ConfirmTitle>You will send</ConfirmTitle>
        <Block marginTop={8}>
          <SendAmount>{eastAmount} EAST</SendAmount>
        </Block>
        <Block24 />
        <ConfirmTitle>To the address</ConfirmTitle>
        <Block marginTop={8}>
          <SendAddress>{address}</SendAddress>
        </Block>
      </Block>
      <Block marginTop={64}>
        <SendButtonsContainer>
          <NavigationLeftGradientButton onClick={() => setCurrentStep(Steps.fill)} />
          <Button type={'primary'} style={{ width: '300px' }}>Confirm and continue</Button>
        </SendButtonsContainer>
      </Block>
    </Container>
  }

  return <PrimaryModal {...props}>
    <PrimaryTitle>{title}</PrimaryTitle>
    {content}
  </PrimaryModal>
}
