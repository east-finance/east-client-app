import React from 'react'
import styled from 'styled-components'
import { Block } from '../../../../components/Block'
import { NavigationLeftGradientButton } from '../../../../components/Button'
import { AddWestToAddress } from '../../common/AddWest'

interface IProps {
  rechargeWestAmount: string;
  eastAmount: string;
  westAmount: string;
  onPrevClicked: () => void;
}

const Container = styled.div`
  margin: 0 auto;
  font-family: Cairo,sans-serif;
  color: ${props => props.theme.darkBlue};
`

const SendButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const RechargeWest = (props: IProps) => {
  return <Container>
    <Block marginTop={64}>
      <AddWestToAddress westAmount={props.rechargeWestAmount} eastAmount={props.eastAmount} />
    </Block>
    <Block marginTop={40}>
      <SendButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
      </SendButtonsContainer>
    </Block>
  </Container>
}
