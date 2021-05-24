import React from 'react'
import styled from 'styled-components'
import { Block } from '../../../../components/Block'
import { Button, NavigationLeftGradientButton } from '../../../../components/Button'
import { TextTable, TextTableKey, TextTablePrimaryValue, TextTableRow, TextTableSecondaryValue } from '../../../../components/TextTable'
import useStores from '../../../../hooks/useStores'

interface IProps {
  westRate: string;
  eastAmount: string;
  westAmount: string;
  onNextClicked: () => void
  onPrevClicked: () => void
}

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
`

const Description = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: #8D8D8D;
`

const SendButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

export const CheckForm = (props: IProps) => {
  const { configStore } = useStores()
  const fee = +(configStore.getDockerCallFee() + configStore.getTransferFee() + configStore.getAtomicFee())
  return <Container>
    <Block marginTop={58}>
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
            <div>{fee} WEST</div>
          </TextTableSecondaryValue>
        </TextTableRow>
      </TextTable>
    </Block>
    <Block marginTop={42}>
      <Description>We convert  some of your WEST into USDp to maintain EAST stability. Learn more</Description>
    </Block>
    <Block marginTop={40}>
      <SendButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
        <Button type={'primary'} style={{ width: '300px' }} onClick={props.onNextClicked}>Continue</Button>
      </SendButtonsContainer>
    </Block>
  </Container>
}
