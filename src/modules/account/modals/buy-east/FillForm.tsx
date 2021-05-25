import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block24 } from '../../../../components/Block'
import { InputStatus, SimpleInput } from '../../../../components/Input'
import { Button } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import { roundNumber } from '../../../../utils'

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
  font-weight: 500;
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
  const [eastError, setEastError] = useState('')
  const [westError, setWestError] = useState('')

  const onChangeEast = (e: any) => {
    const { value } = e.target
    setEastAmount(value)
    const westAmount = dataStore.calculateWestAmount({
      usdpPart: configStore.getUsdpPart(),
      westCollateral: configStore.getWestCollateral(),
      westRate: +westRate,
      usdpRate: +usdpRate,
      inputEastAmount: +value
    })
    if (westAmount > 0) {
      setWestAmount(roundNumber(westAmount).toString())
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
      setEastAmount(roundNumber(eastAmount).toString())
    } else {
      setEastAmount('')
    }
  }

  const onNextClicked = () => {
    if (eastAmount && westAmount) {
      props.onNextClicked({
        eastAmount,
        westAmount
      })
    } else {
      let eastErrorMsg = ''
      let westErrorMsg = ''
      if(!eastAmount) {
        eastErrorMsg = 'Zero amount'
      }
      if (!westAmount) {
        westErrorMsg = 'Zero amount'
      }
      setEastError(eastErrorMsg)
      setWestError(westErrorMsg)
    }
  }
  const usdpPartPercent = configStore.getUsdpPart() * 100
  const westPartPercent = configStore.getWestCollateral() * 100
  return <Container>
    <Block marginTop={40}>
      <RateTitle>Current WEST price is {roundNumber(props.westRate)}$</RateTitle>
    </Block>
    <Block marginTop={24}>
      <SimpleInput
        type={'number'}
        label={'Amount of EAST'}
        value={eastAmount}
        status={eastError ? InputStatus.error : InputStatus.default}
        onChange={onChangeEast}
      />
      <Block marginTop={4} />
      <SimpleInput
        type={'number'}
        label={'Amount of WEST'}
        value={westAmount}
        status={westError ? InputStatus.error : InputStatus.default}
        onChange={onChangeWest}
      />
    </Block>
    <div>
      <Description>EAST is collateralized by {usdpPartPercent}% USDP and {westPartPercent}% WEST.</Description>
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
