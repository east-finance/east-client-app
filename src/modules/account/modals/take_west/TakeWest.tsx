import React, { ChangeEvent, useState } from 'react'
import { PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { Block } from '../../../../components/Block'
import styled from 'styled-components'
import { InputStatus, SimpleInput } from '../../../../components/Input'
import { ITag, Tags } from '../../../../components/Tags'
import { Button } from '../../../../components/Button'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import useStores from '../../../../hooks/useStores'

interface IProps {
  onClose: () => void
}

const Container = styled.div`
  margin: 0 auto;
  width: 440px;
`

const Centered = styled.div`
  width: 304px;
  margin: 0 auto;
`

export const TakeWest = (props: IProps) => {
  const { dataStore } = useStores()
  const [westAmount, setWestAmount] = useState('')
  const [validationError, setValidationError] = useState('')
  const [inProgress, setInProgress] = useState(false)

  const westAvailable = dataStore.westBalance

  const validateForm = (value: string) => {
    let error = ''
    if(!value || +value === 0) {
      error = 'Empty value'
    } else if(+value > +dataStore.westBalance) {
      error = 'Not enough WEST to withdraw'
    } else if (+value < 0) {
      error = 'Negative value'
    }
    return error
  }

  const buyOptions = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = +tag.value * dataStore.westBalance
    setWestAmount(amount.toString())
    const error = validateForm(amount.toString())
    setValidationError(error)
  }

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWestAmount(value)
    const error = validateForm(value)
    setValidationError(error)
  }

  const onWithdrawClicked = async () => {
    const error = validateForm(westAmount)
    setValidationError(error)
    if (!error) {
      try {
        setInProgress(true)
        await new Promise(resolve => setTimeout(resolve, 4000))
      } catch (e) {
        console.error('Error on withdraw:', e.message)
      } finally {
        setInProgress(false)
      }
    }
  }

  return <PrimaryModal {...props}>
    <PrimaryTitle>take west out of the vault</PrimaryTitle>
    <Block marginTop={162}>
      <Container>
        <SimpleInput
          type={'number'}
          status={validationError ? InputStatus.error : InputStatus.default}
          label={`Enter amount of WEST (${westAvailable} available)`}
          value={westAmount}
          onChange={onChangeInput}
        />
        <Block marginTop={8}>
          <Tags data={buyOptions} onClick={onSelectOption} />
        </Block>
      </Container>
    </Block>
    <Block marginTop={130}>
      <Centered>
        <Button type={'primary'} disabled={inProgress || !westAmount || !!validationError} onClick={onWithdrawClicked}>
          <RelativeContainer>
            {inProgress && <ButtonSpinner />}
            Withdraw WEST
          </RelativeContainer>
        </Button>
      </Centered>
    </Block>
  </PrimaryModal>
}
