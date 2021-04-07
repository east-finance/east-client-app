import React from 'react'
import styled from 'styled-components'

interface CardProps {
  value: string;
  address: string;
  onClick: () => void;
}

const Container = styled.div`
  width: 444px;
  height: 260px;
  padding: 52px 72px 24px 32px;
  background: radial-gradient(97.31% 97.31% at 50% 2.69%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 79%), #000000;
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
`

const Value = styled.div`
  font-family: 'Exo';
  font-size: 48px;
  color: #BEBEBE;
  font-weight: 300;
  letter-spacing: 3px;
`

const Address = styled.div`
  color: #BEBEBE;
  font-weight: 300;
  font-size: 16px;
`

export const AccountCard = (props: CardProps) => {
  return <Container onClick={props.onClick}>
    <Value>{props.value}</Value>
    <Address>{props.address}</Address>
  </Container>
}
