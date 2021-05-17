import React, { useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block, Block16, Block24 } from '../../../components/Block'
import { InputStatus, SimpleInput } from '../../../components/Input'
import { Button, NavigationLeftGradientButton } from '../../../components/Button'
import { dockerCallTransfer } from '../../../utils/txFactory'
import useStores from '../../../hooks/useStores'

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
  const { configStore } = useStores()

  const [eastAmount, setEastAmount] = useState('')
  const [address, setAddress] = useState('')
  const [currentStep, setCurrentStep] = useState(Steps.fill)

  let content = null
  let title = ''

  const onClickContinue = () => {
    if (eastAmount && address) {
      setCurrentStep(Steps.confirm)
    }
  }

  const onConfirmTransfer = async () => {
    const state = await window.WEWallet.publicState()
    console.log('WALLET state', state)
    const { account: { publicKey } } = state
    const tx = dockerCallTransfer({
      publicKey,
      contractId: configStore.getEastContractId(),
      recipient: address,
      eastAmount: +eastAmount
    })
    const result = await window.WEWallet.broadcast('dockerCallV3', tx)
    console.log('result', result)
  }

  if (currentStep === Steps.fill) {
    title = 'transfer east'
    content = <Container>
      <Block marginTop={109}>
        <SimpleInput type={'number'} label={'Amount of EAST'} value={eastAmount} onChange={(e:  any) => setEastAmount(e.target.value)} />
      </Block>
      <SimpleInput label={'Address'} value={address} onChange={(e:  any) => setAddress(e.target.value)} />
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
          <Button type={'primary'} style={{ width: '300px' }} onClick={onConfirmTransfer}>Confirm and continue</Button>
        </SendButtonsContainer>
      </Block>
    </Container>
  }

  return <PrimaryModal {...props}>
    <PrimaryTitle>{title}</PrimaryTitle>
    {content}
  </PrimaryModal>
}
