import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Block } from '../../../../components/Block'
import { InputStatus, SimpleInput } from '../../../../components/Input'
import { Button, ButtonsContainer } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import { roundNumber } from '../../../../utils'
import { observer } from 'mobx-react'
import { ITag, TagOption, Tags } from '../../../../components/Tags'
import { EastOpType } from '../../../../interfaces'
import { GradientText } from '../../../../components/Text'

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

const WestPostfix = styled.div`
  position: absolute;
  right: 20px;
  bottom: 8px;
  font-size: 16px;
  font-weight: 700;
`

export const FillIssueForm = observer((props: IProps) => {
  const { dataStore, configStore } = useStores()
  const { westRate, usdapRate } = dataStore
  const [eastAmount, setEastAmount] = useState(props.eastAmount || '')
  const [westAmount, setWestAmount] = useState(props.westAmount || '')
  const [errors, setErrors] = useState({ east: '', west: '' })

  const { supplyVaultWestDiff } = dataStore

  const totalFee = +configStore.getFeeByOpType(EastOpType.supply)

  useEffect(() => {
    if (errors.east || errors.west) {
      setErrors(validateForm())
    }
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
      westAmount: west
    })
    if (eastAmount > 0) {
      setEastAmount(roundNumber(eastAmount).toString())
    } else {
      setEastAmount('')
    }
  }

  const setWestByEastAmount = (east: string) => {
    const westAmount = dataStore.calculateWestAmount(east)
    if (westAmount > 0) {
      setWestAmount(roundNumber(westAmount).toString())
    } else {
      setWestAmount('')
    }
  }

  const onChangeEast = (e: any) => {
    const { value } = e.target
    setEastAmount(value)
    setWestByEastAmount(value)
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
  const westAvailable = +dataStore.westBalance - +totalFee
  const buyOptions = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = roundNumber(+tag.value * westAvailable, 8).toString()
    setWestAmount(amount)
    setEastByWestAmount(amount)
  }
  const onBlur = () => {
    setErrors(validateForm())
  }
  const { eastAmount: freeEastAmount } = dataStore.vaultEastProfit
  const onSelectFreeEast = () => {
    const rounded = freeEastAmount.toString()
    setEastAmount(rounded)
    setWestByEastAmount(rounded)
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
      {+freeEastAmount > 0 &&
      <Block marginTop={8}>
        <Tags>
          <TagOption style={{ background: 'rgba(28, 182, 134, 0.4)' }} onClick={onSelectFreeEast}>
            {freeEastAmount} FREE EAST
          </TagOption>
        </Tags>
      </Block>
      }
      <Block marginTop={4} style={{ position: 'relative' }}>
        {supplyVaultWestDiff > 0 &&
          <WestPostfix>
            <GradientText>+{supplyVaultWestDiff} WEST</GradientText>
          </WestPostfix>
        }
        <SimpleInput
          type={'number'}
          label={`Enter amount of WEST (${westAvailable} available)`}
          value={westAmount}
          status={errors.west ? InputStatus.error : InputStatus.default}
          onChange={onChangeWest}
          onBlur={onBlur}
        />
      </Block>
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
