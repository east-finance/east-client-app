import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block16, Block24 } from '../../../../components/Block'
import { Steps } from './constants'
import { SimpleInput } from '../../../../components/Input'
import { Button, NavigationLeftGradientButton } from '../../../../components/Button'

interface IProps {
  eastToWest: number;
  eastAmount: string;
  westAmount: string;
  onNextClicked: () => void
  onPrevClicked: () => void
}

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
`

const Table = styled.div`
  width: 250px;
  margin: 0 auto;
`

const TableRow = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: end;
`

const Text = styled.div`
  width: 60%;
  color: #000000;
  opacity: 0.6;
  font-size: 15px;
`

const PrimaryValue = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: #000000;
`

const SecondaryValue = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #525252;
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
  return <Container>
    <Block marginTop={58}>
      <Table>
        <TableRow>
          <Text>You will get</Text>
          <PrimaryValue>{props.eastAmount} EAST</PrimaryValue>
        </TableRow>
        <TableRow>
          <Text>You will pay</Text>
          <SecondaryValue>{props.westAmount} WEST</SecondaryValue>
        </TableRow>
        <TableRow>
          <Text>Will be in vault</Text>
          <SecondaryValue>
            <div>300 WEST</div>
            <div>50 USDp</div>
          </SecondaryValue>
        </TableRow>
      </Table>
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
