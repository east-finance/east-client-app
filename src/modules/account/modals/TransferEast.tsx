import React, { useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block, Block16, Block24 } from '../../../components/Block'
import { InputStatus, SimpleInput } from '../../../components/Input'
import { Button, ButtonsContainer, NavigationLeftGradientButton } from '../../../components/Button'
import { dockerCallTransfer } from '../../../utils/txFactory'
import useStores from '../../../hooks/useStores'
import { ITag, Tags } from '../../../components/Tags'
import { roundNumber } from '../../../utils'
import { TxSendSuccess } from '../common/TxSendSuccess'
import { ButtonSpinner, RelativeContainer } from '../../../components/Spinner'
import { observer } from 'mobx-react'

interface IProps {
  onClose: () => void
}

const Container = styled.div`
  width: 464px;
  margin: 0 auto;
`

const SubTitle = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
`

const ConfirmTitle = styled.div`
  opacity: 0.6;
  font-size: 15px;
`

const SendAmount = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
`

const SendAddress = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
`

const Fee = styled.div`
  color: #043569;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
`

enum Steps {
  fill = 'fill',
  confirm = 'confirm',
  success = 'success'
}

export const TransferEast = observer((props: IProps) => {
  const { configStore, dataStore } = useStores()

  const eastAvailable = dataStore.eastBalance

  const [eastAmount, setEastAmount] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [formErrors, setFormErrors] = useState({ east: '', address: '' })
  const [currentStep, setCurrentStep] = useState(Steps.fill)
  const [inProgress, setInProgress] = useState(false)

  let content = null
  let title = 'transfer east'

  const validateForm = () => {
    let east = ''
    let address = ''
    if (!eastAmount || +eastAmount === 0) {
      east = 'Enter EAST amount'
    } else if (+eastAmount > eastAvailable) {
      east = 'Not enought EAST on balance'
    }
    if (!userAddress) {
      address = 'Enter address'
    }
    return {
      east, address
    }
  }

  const onClickContinue = () => {
    const { east, address } = validateForm()
    setFormErrors({ east, address })
    if (!east && !address) {
      setCurrentStep(Steps.confirm)
    }
  }

  const options = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = roundNumber((+tag.value * dataStore.eastBalance).toString(), 8)
    setEastAmount(amount.toString())
  }

  const onConfirmTransfer = async () => {
    try {
      setInProgress(true)
      const state = await window.WEWallet.publicState()
      console.log('WALLET state', state)
      const { account: { publicKey } } = state
      const tx = dockerCallTransfer({
        publicKey,
        contractId: configStore.getEastContractId(),
        recipient: userAddress,
        eastAmount: +eastAmount
      })
      const result = await window.WEWallet.broadcast('dockerCallV3', tx)
      console.log('Broadcast transdfer EAST result:', result)
      setCurrentStep(Steps.success)
    } catch(e) {
      console.error('Broadcast transfer EAST error: ', e.message)
    } finally {
      setInProgress(false)
    }
  }

  if (currentStep === Steps.fill) {
    content = <Container>
      <Block marginTop={96}>
        <SimpleInput
          type={'number'}
          status={formErrors.east ? InputStatus.error : InputStatus.default}
          label={`Enter amount of EAST (${eastAvailable} available)`}
          value={eastAmount}
          onChange={(e: any) => setEastAmount(e.target.value)}
        />
        <Block marginTop={8}>
          <Tags data={options} onClick={onSelectOption} />
        </Block>
      </Block>
      <SimpleInput
        status={formErrors.address ? InputStatus.error : InputStatus.default}
        label={'Enter recipient’s address'}
        value={userAddress}
        onChange={(e:  any) => setUserAddress(e.target.value)}
      />
      <Block marginTop={96}>
        <Button style={{ width: '304px', margin: '0 auto' }} type={'primary'} onClick={onClickContinue}>Continue</Button>
      </Block>
    </Container>
  } else if(currentStep === Steps.confirm) {
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
          <SendAddress>{userAddress}</SendAddress>
        </Block>
        <Block marginTop={24}>
          <ConfirmTitle>Fee</ConfirmTitle>
          <Block marginTop={8}>
            <Fee>{configStore.getDockerCallFee()} WEST</Fee>
          </Block>
        </Block>
      </Block>
      <Block marginTop={64}>
        <ButtonsContainer style={{ width: '80%', margin: '0 auto' }}>
          <NavigationLeftGradientButton onClick={() => setCurrentStep(Steps.fill)} />
          <Button type={'primary'} disabled={inProgress} onClick={onConfirmTransfer}>
            <RelativeContainer>
              {inProgress && <ButtonSpinner />}
              Confirm and continue
            </RelativeContainer>
          </Button>
        </ButtonsContainer>
      </Block>
    </Container>
  } else {
    content = <TxSendSuccess
      text={'EAST will be transfered after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  }

  return <PrimaryModal {...props}>
    <PrimaryTitle>{title}</PrimaryTitle>
    {content}
  </PrimaryModal>
})
