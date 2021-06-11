import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Block, Block24 } from '../../../../components/Block'
import { InputStatus, SimpleInput } from '../../../../components/Input'
import { Button, ButtonsContainer, NavigationLeftGradientButton } from '../../../../components/Button'
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
  eastAmount: string;
  westAmount: string;
  onNextClicked: (formData: FillFormData) => void
}

const Container = styled.div`
  width: 464px;
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

export const FillIssueForm = observer((props: IProps) => {
  const { dataStore, configStore } = useStores()
  const { westRate, usdapRate } = dataStore
  const [eastAmount, setEastAmount] = useState(props.eastAmount || '')
  const [westAmount, setWestAmount] = useState(props.westAmount || '')
  const [errors, setErrors] = useState({ east: '', west: '' })

  useEffect(() => {
    // setErrors(validateForm())
  }, [eastAmount, westAmount])

  const validateForm = () => {
    let east = ''
    let west = ''
    if (!eastAmount || +eastAmount === 0) {
      east = 'Empty east amount'
    } else if (+eastAmount < 0) {
      east = 'Negative east amount'
    }
    if (!westAmount || +westAmount === 0) {
      west = 'Empty east amount'
    } else if (+westAmount < 0) {
      west = 'Negative west amount'
    }
    return {
      east,
      west
    }
  }

  const setEastByWestAmount = (west: string) => {
    const { eastAmount } = dataStore.calculateEastAmount({
      usdpPart: configStore.getUsdpPart(),
      westCollateral: configStore.getWestCollateral(),
      westRate: +westRate,
      usdapRate: +usdapRate,
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
      usdapRate: +usdapRate,
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
    const errors = validateForm()
    setErrors(errors)
    if (!errors.east && !errors.west) {
      props.onNextClicked({
        eastAmount,
        westAmount
      })
    }
  }
  const usdpPartPercent = configStore.getUsdpPart() * 100
  const westPartPercent = configStore.getWestCollateral() * 100
  const westAvailable = roundNumber(dataStore.westBalance)
  const buyOptions = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = roundNumber(+tag.value * dataStore.westBalance, 8).toString()
    setWestAmount(amount)
    setEastByWestAmount(amount)
  }
  const onBlur = () => {
    setErrors(validateForm())
  }
  return <Container>
    <Block marginTop={16}>
      <SimpleInput
        type={'number'}
        label={'Enter amount of EAST'}
        value={eastAmount}
        status={errors.east ? InputStatus.error : InputStatus.default}
        onChange={onChangeEast}
        onBlur={onBlur}
      />
      <Block marginTop={4} />
      <SimpleInput
        type={'number'}
        label={`Enter amount of WEST (${westAvailable} available)`}
        value={westAmount}
        status={errors.west ? InputStatus.error : InputStatus.default}
        onChange={onChangeWest}
        onBlur={onBlur}
      />
      {+dataStore.westBalance > 0 &&
        <Block marginTop={8}>
          <Tags data={buyOptions} onClick={onSelectOption} />
        </Block>
      }
    </Block>
    <Block marginTop={62}>
      <ButtonsContainer>
        <Button type={'primary'} onClick={onNextClicked} style={{ width: '304px' }}>
          Continue to confirmation
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
})
