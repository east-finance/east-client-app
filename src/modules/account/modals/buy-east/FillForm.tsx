import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Block, Block24 } from '../../../../components/Block'
import { InputStatus, SimpleInput } from '../../../../components/Input'
import { Button } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import { roundNumber } from '../../../../utils'
import { observer } from 'mobx-react'
import { BeforeText, RelativeContainer, Spinner } from '../../../../components/Spinner'
import { ITag, Tags } from '../../../../components/Tags'
import { EastOpType } from '../../../../interfaces'
import { MinimumMintEastAmount } from '../../../../constants'

export interface FillFormData {
  eastAmount: string;
  westAmount: string;
}

interface IProps {
  westRate: string;
  usdapRate: string;
  eastAmount: string;
  westAmount: string;
  inProgress: boolean;
  onNextClicked: (formData: FillFormData) => void
}

const Container = styled.div`
  @media screen and (min-width: 900px) {
    width: 376px;
  }
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

const Link = styled.a`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
`

export const FillForm = observer((props: IProps) => {
  const { dataStore, configStore } = useStores()
  const [eastAmount, setEastAmount] = useState(props.eastAmount)
  const [westAmount, setWestAmount] = useState(props.westAmount)
  const [errors, setErrors] = useState({ east: '', west: '' })

  useEffect(() => {
    if(errors.east || errors.west) {
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
    } else if (+eastAmount < MinimumMintEastAmount) {
      east = `Minimum amount: ${MinimumMintEastAmount} EAST`
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

  const setEastByWestAmount = (value: string) => {
    const { eastAmount } = dataStore.calculateEastAmount(value)
    if (eastAmount > 0) {
      setEastAmount(roundNumber(eastAmount, 8).toString())
    } else {
      setEastAmount('')
    }
  }

  const setWestByEastAmount = (value: string) => {
    const westAmount = dataStore.calculateWestAmount(value)
    setWestAmount(westAmount > 0 ? westAmount.toString() : '')
  }

  const onChangeEast = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEastAmount(value)
    setWestByEastAmount(value)
  }

  const onBlurEast = (e: FocusEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEastAmount(value)
    setWestByEastAmount(value)
  }

  const onChangeWest = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setWestAmount(value)
    setEastByWestAmount(value)
  }

  const onBlurWest = (e: FocusEvent<HTMLInputElement>) => {
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
  const usdpPartPercent = configStore.getRwaPart() * 100
  const westPartPercent = configStore.getWestCollateral() * 100
  const totalFee = +configStore.getFeeByOpType(EastOpType.mint)
  const westAvailable = Math.max(roundNumber(+dataStore.westBalance - +totalFee, 8), 0)
  const buyOptions = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = roundNumber(+tag.value * +westAvailable, 8).toString()
    setWestAmount(amount)
    setEastByWestAmount(amount)
  }
  return <Container>
    <Block marginTop={'15%'}>
      <SimpleInput
        id={'input-east'}
        type={'number'}
        label={`Enter amount of EAST (minimum: ${MinimumMintEastAmount} EAST)`}
        value={eastAmount}
        status={errors.east ? InputStatus.error : InputStatus.default}
        onChange={onChangeEast}
        onBlur={onBlurEast}
      />
      <Block marginTop={4} />
      <SimpleInput
        id={'input-west'}
        type={'number'}
        label={`Enter amount of WEST (${westAvailable} available)`}
        value={westAmount}
        status={errors.west ? InputStatus.error : InputStatus.default}
        onChange={onChangeWest}
        onBlur={onBlurWest}
      />
      {+dataStore.westBalance > 0 &&
        <Block marginTop={8}>
          <Tags data={buyOptions} onClick={onSelectOption} />
        </Block>
      }
    </Block>
    <Block marginTop={'10%'}>
      <Description>EAST is collateralized by {usdpPartPercent}% USDP and {westPartPercent}% WEST</Description>
      <Centered><Link href={'https://wavesenterprise.com/'} target={'_blank'}>Learn more</Link></Centered>
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
