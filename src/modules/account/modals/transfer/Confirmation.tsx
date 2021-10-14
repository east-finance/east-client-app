import React from 'react'
import { Block, Block16, Block24 } from '../../../../components/Block'
import { Button, ButtonsContainer, NavigationLeftGradientButton } from '../../../../components/Button'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import styled from 'styled-components'


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
  line-break: anywhere;
`

const Fee = styled.div`
  color: #043569;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
`

const SubTitle = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
`

export interface IConfirmationProps {
  inProgress: boolean;
  eastAmount: string;
  totalFee: number;
  userAddress: string;
  onPrevClicked: () => void;
  onSuccess: () => void;
}

export const TransferConfirmation = (props: IConfirmationProps) => {
  return <div>
    <Block16>
      <SubTitle>Confirmation</SubTitle>
    </Block16>
    <Block marginTop={'5%'} style={{ 'textAlign': 'center' }}>
      <ConfirmTitle>You will send</ConfirmTitle>
      <Block marginTop={8}>
        <SendAmount>{props.eastAmount} EAST</SendAmount>
      </Block>
      <Block24 />
      <ConfirmTitle>To the address</ConfirmTitle>
      <Block marginTop={8}>
        <SendAddress>{props.userAddress}</SendAddress>
      </Block>
      <Block marginTop={24}>
        <ConfirmTitle>Fee</ConfirmTitle>
        <Block marginTop={8}>
          <Fee>{props.totalFee} WEST</Fee>
        </Block>
      </Block>
    </Block>
    <Block marginTop={'10%'}>
      <ButtonsContainer style={{ width: '80%', margin: '0 auto' }}>
        <NavigationLeftGradientButton data-attr={'transferEast-2_back'} onClick={props.onPrevClicked} />
        <Button type={'primary'} data-attr={'transferEast-2_continueButton'} disabled={props.inProgress} onClick={props.onSuccess}>
          <RelativeContainer>
            {props.inProgress && <ButtonSpinner />}
            Confirm and continue
          </RelativeContainer>
        </Button>
      </ButtonsContainer>
    </Block>
  </div>
}
