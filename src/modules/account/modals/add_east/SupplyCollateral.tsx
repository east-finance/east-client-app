import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block32 } from '../../../../components/Block'
import { Button } from '../../../../components/Button'
import ArrowLeft from '../../../../resources/images/arrow-left.svg'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import { CollateralCircle } from '../../../../components/CollateralCircle'
import useStores from '../../../../hooks/useStores'
import { roundNumber } from '../../../../utils'
import { toast } from 'react-toastify'
import { ErrorNotification } from '../../../../components/Notification'
import { GradientText } from '../../../../components/Text'

export interface IProps {
  westAmount: number;
  vaultCollateral: number;
  onSuccess: () => void;
}

const Container = styled.div`
  font-size: 15px;
  line-height: 20px;
  font-family: Cairo;
`

const Centered = styled.div`
  max-width: 388px;
  margin: 0 auto;
  line-height: 24px;
  text-align: center;
`

const Collaterals = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Arrow = styled.div`
  width: 42px;
  height: 42px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  mask-image: url(${ArrowLeft});
  background-color: ${props => props.theme.darkBlue};
  transform: rotate(180deg);
`

const ButtonContainer = styled.div`
  width: 304px;
  margin: 0 auto;
`

export const SupplyCollateral = (props: IProps) => {
  const { dataStore } = useStores()

  return <Container>
    <Block marginTop={40}>
      <Collaterals>
        <CollateralCircle value={Math.round(props.vaultCollateral * 100)} />
        <Arrow />
        <CollateralCircle value={250} />
      </Collaterals>
    </Block>
    <Block32>
      <Centered>Collaterization leveling required.</Centered>
      <Centered>You will need to add <GradientText style={{ fontWeight: 700 }}>{props.westAmount} WEST</GradientText> into the Vault to continue.</Centered>
      <Centered>On wallet: {dataStore.westBalance} WEST.</Centered>
    </Block32>
    <Block marginTop={28}>
      <ButtonContainer>
        <Button type={'primary'} onClick={props.onSuccess}>
          Continue
        </Button>
      </ButtonContainer>
    </Block>
  </Container>
}
