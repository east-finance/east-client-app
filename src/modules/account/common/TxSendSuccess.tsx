import React, { useState } from 'react'
import styled from 'styled-components'
import { Block } from '../../../components/Block'
import { Button, ButtonsContainer } from '../../../components/Button'
import iconSuccess from '../../../resources/images/success.png'

interface IProps {
  text: string;
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
  color: #1CB686;
`

export const TxSendSuccess = (props: IProps) => {
  return <Container>
    <Block marginTop={'15%'}>
      <IconSuccess />
    </Block>
    <Block marginTop={32}>
      <div>The request has been created.</div>
      <div>{props.text}</div>
    </Block>
    <Block marginTop={'15%'}>
      <ButtonsContainer>
        <Button type={'primary'} onClick={props.onClose}>Close this window</Button>
      </ButtonsContainer>
    </Block>
  </Container>
}
