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
  westAmount: string;
}

interface IProps {
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

export const FillSupplyForm = observer((props: IProps) => {
  const { dataStore, configStore } = useStores()
  const { westRate, usdapRate } = dataStore
  const [westAmount, setWestAmount] = useState(props.westAmount || '')
  const [errors, setErrors] = useState({ west: '' })

  useEffect(() => {
    if (errors.west) {
      setErrors(validateForm())
    }
  }, [westAmount])

  const validateForm = () => {
    let west = ''
    if (!westAmount || +westAmount === 0) {
      west = 'Empty east amount'
    } else if (+westAmount < 0) {
      west = 'Negative west amount'
    }
    return {
      west
    }
  }

  const onChangeWest = (e: any) => {
    const { value } = e.target
    setWestAmount(value)
  }

  const onNextClicked = () => {
    const errors = validateForm()
    setErrors(errors)
    if (!errors.west) {
      props.onNextClicked({
        westAmount
      })
    }
  }
  const westAvailable = roundNumber(dataStore.westBalance, 8)
  const buyOptions = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = roundNumber(+tag.value * dataStore.westBalance, 8).toString()
    setWestAmount(amount)
  }
  const onBlur = () => {
    setErrors(validateForm())
  }
  return <Container>
    <Block marginTop={80}>
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
    <Block marginTop={80}>
      <ButtonsContainer>
        <Button type={'primary'} onClick={onNextClicked} style={{ width: '304px' }}>
          Continue to confirmation
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
})
