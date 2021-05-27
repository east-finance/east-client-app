import React from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import CardBackground from '../../resources/images/card_bg.png'
import { PrimaryModal } from '../Modal'
import { Block } from '../../../components/Block'
import { GradientText } from '../../../components/Text'

interface IProps {
  onClose: () => void
}

const Description = styled.div`
  margin: 0 auto;
  max-width: 500px;
  font-family: Montserrat,sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
`

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 48px;
  margin-bottom: 48px;
`

const TextItem = styled(GradientText)`
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;

  &:not(:first-child) {
    margin-top: 24px;
  }
`

export const FAQ = (props: IProps) => {
  return <PrimaryModal {...props}>
    <PrimaryTitle>FAQ</PrimaryTitle>
    <Block marginTop={44} />
    <Description>
      Here you can find articles about how EAST works, why is it safe and everything else.
      If you have any questions, feel free to contact us: mail@mail.ru or tg channel
    </Description>
    <ItemsContainer>
      <TextItem>How does EAST work?</TextItem>
      <TextItem>Why should I trust EAST?</TextItem>
      <TextItem>What are batches?</TextItem>
      <TextItem>What happens if WEST price goes up or down?</TextItem>
      <TextItem>What is USDp?</TextItem>
      <TextItem>How to trade with EAST?</TextItem>
      <TextItem>How to return EAST and get my WEST back?</TextItem>
    </ItemsContainer>
  </PrimaryModal>
}
