import React from 'react'
import styled from 'styled-components'
import { Block } from '../../../../components/Block'
import { AddWestToAddress } from '../../common/AddWestToAddress'

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

export const RechargeWest = (props: IProps) => {
  return <Container>
    <Block marginTop={64}>
      <AddWestToAddress westAmount={props.rechargeWestAmount} eastAmount={props.eastAmount} onPrevClicked={props.onPrevClicked} />
    </Block>
  </Container>
}
