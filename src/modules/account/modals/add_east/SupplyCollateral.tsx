import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block32 } from '../../../../components/Block'
import { Button } from '../../../../components/Button'
import ArrowLeft from '../../../../resources/images/arrow-left.svg'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import { CollateralCircle, CollateralCircle2 } from '../../../../components/CollateralCircle'
import useStores from '../../../../hooks/useStores'
import { roundNumber } from '../../../../utils'
import { useRoute } from 'react-router5'
import { RouteName } from '../../../../router/segments'

export interface IProps {
  westAmount: string;
  onSuccess: () => void;
}

const Container = styled.div`
  font-size: 15px;
  line-height: 20px;
`

const Centered = styled.div`
  width: 208px;
  margin: 0 auto;
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
  const { router } = useRoute()
  const [inProgress, setInProgress] = useState(false)

  const addWest = async () => {
    try {
      setInProgress(true)
      await new Promise(resolve => {
        setTimeout(resolve, 100)
      })
      props.onSuccess()
    } catch (e) {
      console.error('Add WEST error:', e.message)
    } finally {
      setInProgress(false)
    }
  }

  return <Container>
    <Block marginTop={40}>
      <Collaterals>
        <CollateralCircle percent={170} />
        <Arrow />
        <CollateralCircle percent={250} />
      </Collaterals>
    </Block>
    <Block32>
      <Centered>Collaterization leveling required.</Centered>
      <Centered>Add {props.westAmount} WEST into the Vault.</Centered>
      <Centered>On wallet: {roundNumber(dataStore.westBalance, 8)} WEST.</Centered>
    </Block32>
    <Block marginTop={28}>
      <ButtonContainer>
        <Button type={'primary'} disabled={inProgress} onClick={addWest}>
          <RelativeContainer>
            {inProgress && <ButtonSpinner />}
            Add {props.westAmount} WEST and continue
          </RelativeContainer>
        </Button>
      </ButtonContainer>
    </Block>
  </Container>
}
