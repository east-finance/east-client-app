import React from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block } from '../../../components/Block'
import { GradientText } from '../../../components/Text'
import { Link } from 'react-router5'

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
        <TextItem><a href={'https://east.finance/faq#howitworks'} target={'_blank'} rel="noreferrer">How does EAST work?</a></TextItem>
        <TextItem><a href={'https://east.finance/faq#whycanitrust'} target={'_blank'} rel="noreferrer">Why can I trust EAST?</a></TextItem>
        <TextItem><a href={'https://east.finance/faq#howstablecourse'} target={'_blank'} rel="noreferrer">How stable course?</a></TextItem>
        <TextItem><a href={'https://east.finance/faq#whatisvault'} target={'_blank'} rel="noreferrer">What is vault?</a></TextItem>
      </ItemsContainer>
      <ItemsContainer>
        <Title>Practical stuff</Title>
        <TextItem><a href={'https://east.finance/faq#howtoissue'} target={'_blank'} rel="noreferrer">How to get EAST?</a></TextItem>
        <TextItem><a href={'https://east.finance/faq#westpricechange'} target={'_blank'} rel="noreferrer">What happens if WEST price goes up or down?</a></TextItem>
        <TextItem><a href={'https://east.finance/faq#easttrading'} target={'_blank'} rel="noreferrer">How to trade with EAST?</a></TextItem>
        <TextItem><a href={'https://east.finance/faq#withdrawwest'} target={'_blank'} rel="noreferrer">How to get my WEST back?</a></TextItem>
      </ItemsContainer>
    </FlexContainer>
  </PrimaryModal>
}
