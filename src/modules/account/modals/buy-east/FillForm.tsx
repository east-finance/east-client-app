import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block24 } from '../../../../components/Block'
import { InputStatus, SimpleInput } from '../../../../components/Input'
import { Button } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import { roundNumber } from '../../../../utils'
import { observer } from 'mobx-react'
import { BeforeText, RelativeContainer, Spinner } from '../../../../components/Spinner'
import { ITag, Tags } from '../../../../components/Tags'

export interface FillFormData {
  eastAmount: string;
  westAmount: string;
}

interface IProps {
  westRate: string;
  usdpRate: string;
  eastAmount: string;
  westAmount: string;
  inProgress: boolean;
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

export const FillForm = observer((props: IProps) => {
  const { westRate, usdpRate } = props
  const { dataStore, configStore } = useStores()
  const [eastAmount, setEastAmount] = useState(props.eastAmount)
  const [westAmount, setWestAmount] = useState(props.westAmount)
  const [eastError, setEastError] = useState('')
  const [westError, setWestError] = useState('')

  const setEastByWestAmount = (west: string) => {
    const { eastAmount } = dataStore.calculateEastAmount({
      usdpPart: configStore.getUsdpPart(),
      westCollateral: configStore.getWestCollateral(),
      westRate: +westRate,
      usdpRate: +usdpRate,
      inputWestAmount: +west
    })
    if (eastAmount > 0) {
      setEastAmount(roundNumber(eastAmount).toString())
    } else {
      setEastAmount('')
    }
  }

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
    setEastByWestAmount(value)
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
  const westAvailable = roundNumber(dataStore.westBalance)
  const buyOptions = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = +tag.value * dataStore.westBalance
    setWestAmount(amount.toString())
    setEastByWestAmount(amount.toString())
  }
  return <Container>
    <Block marginTop={72}>
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
        label={`Amount of WEST (${westAvailable} available)`}
        value={westAmount}
        status={westError ? InputStatus.error : InputStatus.default}
        onChange={onChangeWest}
      />
      {+dataStore.westBalance > 0 &&
        <Tags data={buyOptions} onClick={onSelectOption} />
      }
    </Block>
    <Block marginTop={56}>
      <Description>EAST is collateralized by {usdpPartPercent}% USDP and {westPartPercent}% WEST.</Description>
    </Block>
    <Block24>
      <Button type={'primary'} disabled={props.inProgress} onClick={onNextClicked}>
        <RelativeContainer>
          {props.inProgress &&
            <BeforeText>
              <Spinner />
            </BeforeText>
          }
          Continue to confirmation
        </RelativeContainer>
      </Button>
    </Block24>
  </Container>
})
