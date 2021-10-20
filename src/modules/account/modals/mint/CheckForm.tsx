import React from 'react'
import styled from 'styled-components'
import { Block } from '../../../../components/Block'
import { Button, ButtonsContainer, NavigationLeftGradientButton } from '../../../../components/Button'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import { TextTable, TextTableKey, TextTablePrimaryValue, TextTableRow, TextTableSecondaryValue } from '../../../../components/TextTable'
import useStores from '../../../../hooks/useStores'
import { EastOpType } from '../../../../interfaces'
import { GradientText } from '../../../../components/Text'
import { isDesktop } from 'react-device-detect'

interface IProps {
  westRate: string;
  eastAmount: string;
  westAmount: string;
  inProgress: boolean;
  onNextClicked: () => void
  onPrevClicked: () => void
}

const Container = styled.div`
  @media screen and (min-width: 900px) {
    width: 426px;
  }
  margin: 0 auto;
`

const GradientTextPostfix = styled(GradientText)`
  position: absolute;
  margin-left: 16px;
  font-size: 15px;
  font-weight: 400;
`

export const CheckForm = (props: IProps) => {
  const { configStore } = useStores()
  const totalFee = +configStore.getFeeByOpType(EastOpType.mint)
  return <Container>
    <Block marginTop={70}>
      <TextTable>
        <TextTableRow>
          <TextTableKey>You will get</TextTableKey>
          <TextTablePrimaryValue>
            ~{props.eastAmount} EAST
            {isDesktop &&
              <GradientTextPostfix>
                <a href={'https://east.finance/faq#howitworks'} target={'_blank'} rel="noreferrer">Why approximate?</a>
              </GradientTextPostfix>
            }
          </TextTablePrimaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>You will pay</TextTableKey>
          <TextTableSecondaryValue>{props.westAmount} WEST</TextTableSecondaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>Fee</TextTableKey>
          <TextTableSecondaryValue>
            <div>{totalFee} WEST</div>
          </TextTableSecondaryValue>
        </TextTableRow>
      </TextTable>
    </Block>
    <Block marginTop={60}>
      <ButtonsContainer>
        <NavigationLeftGradientButton data-attr={'mintEast-2_back'} onClick={props.onPrevClicked} />
        <Button type={'primary'} data-attr={'mintEast-2_continueButton'} disabled={props.inProgress} style={{ width: '304px' }} onClick={props.onNextClicked}>
          <RelativeContainer>
            {props.inProgress && <ButtonSpinner />}
            Issue EAST
          </RelativeContainer>
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
}
