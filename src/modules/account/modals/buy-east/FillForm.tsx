import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block16, Block24 } from '../../../../components/Block'
import { Steps } from './constants'
import { SimpleInput } from '../../../../components/Input'
import { Button } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'

export interface FillFormData {
  eastAmount: string;
  westAmount: string;
}

interface IProps {
  westRate: string;
  usdpRate: string;
  eastAmount: string;
  westAmount: string;
  onNextClicked: (formData: FillFormData) => void
}

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
  font-family: Cairo,sans-serif;
`

const Centered = styled.div`text-align: center;`

const Description = styled(Centered)`
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: #525252;
`

const RateTitle = styled(Centered)`
  font-size: 15px;
  line-height: 18px;
  color: #0A0606;
  opacity: 0.6;
`

const Link = styled.div`
  
`

export const FillForm = (props: IProps) => {
  const { westRate, usdpRate } = props
  const { dataStore, configStore } = useStores()
  const [eastAmount, setEastAmount] = useState(props.eastAmount)
  const [westAmount, setWestAmount] = useState(props.westAmount)

  const onChangeEast = (e: any) => {
    const { value } = e.target
    setEastAmount(value)
    const { westAmount } = dataStore.calculateWestAmount({
      usdpPart: configStore.getUsdpPart(),
      westCollateral: configStore.getWestCollateral(),
      westRate: +westRate,
      usdpRate: +usdpRate,
      inputEastAmount: +value
    })
    if (westAmount > 0) {
      setWestAmount(westAmount)
    } else {
      setWestAmount('')
    }
  }

  const onChangeWest = (e: any) => {
    const { value } = e.target
    setWestAmount(value)
    const { eastAmount } = dataStore.calculateEastAmount({
      usdpPart: configStore.getUsdpPart(),
      westCollateral: configStore.getWestCollateral(),
      westRate: +westRate,
      usdpRate: +usdpRate,
      inputWestAmount: +value
    })
    if (eastAmount > 0) {
      setEastAmount(eastAmount)
    } else {
      setEastAmount('')
    }
  }

  const onNextClicked = () => {
    props.onNextClicked({
      eastAmount,
      westAmount
    })
  }
  return <Container>
    <Block marginTop={40}>
      <RateTitle>Current WEST price is {props.westRate}$</RateTitle>
    </Block>
    <Block marginTop={16}>
      <SimpleInput type={'number'} label={'Amount of EAST'} value={eastAmount} onChange={onChangeEast} />
      <Block marginTop={4} />
      <SimpleInput type={'number'} label={'Amount of WEST'} value={westAmount} onChange={onChangeWest} />
    </Block>
    <div>
      <Description>EAST is collateralized by 50% USDP and 250% WEST.</Description>
    </div>
    <Block24>
      <Description>
        Keep in mind – we create a &apos;Batch&apos; every time you buy EAST. It contains locked WEST and USDp.
      </Description>
    </Block24>
    <Block24>
      <Button type={'primary'} onClick={onNextClicked}>Continue</Button>
    </Block24>
  </Container>
}
