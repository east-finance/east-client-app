import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block16 } from '../../../../components/Block'
import { Button } from '../../../../components/Button'
import iconSuccess from '../../../../resources/images/success.png'

interface IProps {
  onClose: () => void;
}

const IconCommon = styled.div`
  width: 80px;
  height: 80px;
  background-repeat: no-repeat;
  background-size: 80px;
`

const IconSuccess = styled(IconCommon)`
  margin: 0 auto;
  background-image: url(${iconSuccess});
  cursor: pointer;
`

const Container = styled.div`
  @media screen and (min-width: 900px) {
    width: 376px;
  }
  margin: 0 auto;
  font-family: Cairo,sans-serif;
  text-align: center;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: #00805E;
`

const SendButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const BuyWestSuccess = (props: IProps) => {
  return <Container>
    <Block marginTop={72}>
      <IconSuccess />
    </Block>
    <Block marginTop={32}>
      <div>The request has been created.</div>
      <div>You will receive your EAST after the transaction is completed. It may take a few minutes.</div>
    </Block>
    <Block marginTop={80}>
      <SendButtonsContainer>
        <Button type={'primary'} onClick={props.onClose}>Close this window</Button>
      </SendButtonsContainer>
    </Block>
  </Container>
}
