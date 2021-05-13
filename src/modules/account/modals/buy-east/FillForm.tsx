import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block16, Block24 } from '../../../../components/Block'
import { Steps } from './constants'
import { SimpleInput } from '../../../../components/Input'
import { Button } from '../../../../components/Button'

export interface FillFormData {
  eastAmount: string;
  westAmount: string;
}

interface IProps {
  eastToWest: number;
  eastAmount: string;
  westAmount: string;
  onNextClicked: (formData: FillFormData) => void
}

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
`

const Description = styled.div`
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  max-width: 314px;
  opacity: 0.6;
`

export const FillForm = (props: IProps) => {
  const { eastToWest } = props
  const [eastAmount, setEastAmount] = useState(props.eastAmount)
  const [westAmount, setWestAmount] = useState(props.westAmount)
  const onChangeEast = (e: any) => {
    const { value } = e.target
    setEastAmount(value)
    setWestAmount((+value * eastToWest).toString())
  }
  const onChangeWest = (e: any) => {
    const { value } = e.target
    setWestAmount(e.target.value)
    setEastAmount((+value / eastToWest).toString())
  }
  const onNextClicked = () => {
    props.onNextClicked({
      eastAmount,
      westAmount
    })
  }
  return <Container>
    <Block marginTop={48}>
      <SimpleInput isFocused={true} label={'Amount of EAST'} value={eastAmount} onChange={onChangeEast} />
      <Block24 />
      <SimpleInput isFocused={true} label={'Amount of WEST'} value={westAmount} onChange={onChangeWest} />
    </Block>
    <Block16>
      <Description>You can type in one currency, the other one will be calculated automatically</Description>
    </Block16>
    <Block24>
      <Button type={'primary'} onClick={onNextClicked}>Continue</Button>
    </Block24>
  </Container>
}
