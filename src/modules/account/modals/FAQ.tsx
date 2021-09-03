import React from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block } from '../../../components/Block'
import { GradientText } from '../../../components/Text'

interface IProps {
  onClose: () => void
}

const Description = styled.div`
  margin: 0 auto;
  max-width: 500px;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
  color: #0A0606;
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

const FlexContainer = styled.div`
  display: flex;
  margin-top: 48px;
  margin-bottom: 48px;
  flex-wrap: wrap;
`

const ItemsContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  min-width: 120px;
`

const Title = styled.div`
  color: #000000;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
`

const supportEmail = 'mail@mail.ru'
const telegramLink = 'https://t.me/wavesenterprisegroup'

export const FAQ = (props: IProps) => {
  return <PrimaryModal {...props} id={'faq-modal'}>
    <PrimaryTitle>FAQ</PrimaryTitle>
    <Block marginTop={44} />
    <Description>
      Here you can find articles about how EAST works, why is it safe and everything else.
      If you have any questions, feel free to contact us: <a href={`mailto:${supportEmail}`}>{supportEmail}</a> or <a href={telegramLink} rel={'noreferrer'} target='_blank'>Telegram</a>
    </Description>
    <FlexContainer>
      <ItemsContainer>
        <Title>General stuff</Title>
        <TextItem>How does EAST work?</TextItem>
        <TextItem>Why can I trust EAST?</TextItem>
        <TextItem>What is vault?</TextItem>
      </ItemsContainer>
      <ItemsContainer>
        <Title>Practical stuff</Title>
        <TextItem>How to get EAST?</TextItem>
        <TextItem>What happens if WEST price goes up or down?</TextItem>
        <TextItem>How to trade with EAST?</TextItem>
        <TextItem>How to get my WEST back?</TextItem>
      </ItemsContainer>
    </FlexContainer>
  </PrimaryModal>
}
