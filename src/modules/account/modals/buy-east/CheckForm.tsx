import React from 'react'
import styled from 'styled-components'
import { Block } from '../../../../components/Block'
import { Button, ButtonsContainer, NavigationLeftGradientButton } from '../../../../components/Button'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import { TextTable, TextTableKey, TextTablePrimaryValue, TextTableRow, TextTableSecondaryValue } from '../../../../components/TextTable'
import useStores from '../../../../hooks/useStores'
import { EastOpType } from '../../../../interfaces'

interface IProps {
  westRate: string;
  eastAmount: string;
  westAmount: string;
  inProgress: boolean;
  onNextClicked: () => void
  onPrevClicked: () => void
}

const Container = styled.div`
  @media screen and (min-width: 900px) {
    width: 376px;
  }
  margin: 0 auto;
`

export const CheckForm = (props: IProps) => {
  const { configStore } = useStores()
  const totalFee = +configStore.getFeeByOpType(EastOpType.mint)
  return <Container>
    <Block marginTop={70}>
      <TextTable>
        <TextTableRow>
          <TextTableKey>You will get</TextTableKey>
          <TextTablePrimaryValue>~{props.eastAmount} EAST</TextTablePrimaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>You will pay</TextTableKey>
          <TextTableSecondaryValue>{props.westAmount} WEST</TextTableSecondaryValue>
        </TextTableRow>
        {/*<TextTableRow>*/}
        {/*  <TextTableKey>Will be in batch</TextTableKey>*/}
        {/*  <TextTableSecondaryValue>*/}
        {/*    <div>300 WEST</div>*/}
        {/*    <div>50 USDp</div>*/}
        {/*  </TextTableSecondaryValue>*/}
        {/*</TextTableRow>*/}
        <TextTableRow>
          <TextTableKey>Fee</TextTableKey>
          <TextTableSecondaryValue>
            <div>{totalFee} WEST</div>
          </TextTableSecondaryValue>
        </TextTableRow>
      </TextTable>
    </Block>
    <Block marginTop={60}>
      <ButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
        <Button type={'primary'} disabled={props.inProgress} style={{ width: '304px' }} onClick={props.onNextClicked}>
          <RelativeContainer>
            {props.inProgress && <ButtonSpinner />}
            Issue EAST
          </RelativeContainer>
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
}
