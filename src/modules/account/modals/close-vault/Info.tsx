import React from 'react'
import { Block } from '../../../../components/Block'
import styled from 'styled-components'
import { Button } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import {
  TextTable,
  TextTableKey,
  TextTablePrimaryValue,
  TextTableRow,
  TextTableSecondaryValue
} from '../../../../components/TextTable'
import { observer } from 'mobx-react'
import { EastOpType, IVault } from '../../../../interfaces'

interface IProps {
  onNextClicked: () => void;
}

const Container = styled.div`
  margin: 0 auto;
  @media screen and (min-width: 900px) {
    width: 400px;
  }
`

const ButtonsContainer = styled.div`
  width: 304px;
  margin: 0 auto;
`

const Description = styled.div`
  font-size: 15px;
  line-height: 20px;
  text-align: center;
`

const Fee = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
  color: ${props => props.theme.darkBlue50}
`

export const CloseVaultInfo = observer((props: IProps) => {
  const { configStore, dataStore } = useStores()
  const { eastBalance } = dataStore
  const vault: IVault = dataStore.vault

  const isDisabled = +eastBalance < +vault.eastAmount
  const buttonText = isDisabled ? 'Lack of EAST in vault' : 'Continue to confirmation'

  return <Container>
    <Block marginTop={40}>
      <Description>
        Give back your EAST to unlock WEST from your vault
      </Description>
    </Block>
    <Block marginTop={60}>
      <TextTable>
        <TextTableRow>
          <TextTableKey>You have</TextTableKey>
          <TextTablePrimaryValue>{eastBalance} EAST</TextTablePrimaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>You will pay</TextTableKey>
          <TextTablePrimaryValue>
            <div>{vault.eastAmount} EAST</div>
            <Block marginTop={8}>
              <Fee>+ {configStore.getFeeByOpType(EastOpType.close_init)} WEST fee</Fee>
            </Block>
          </TextTablePrimaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>You will unlock</TextTableKey>
          <TextTableSecondaryValue>
            <div>{vault.westAmount} WEST</div>
            {+vault.rwaAmount > 0 &&
              <div style={{marginTop: '8px'}}>{vault.rwaAmount} USDap</div>
            }
            <Block marginTop={8}>
              <Fee>- {configStore.getCloseAdditionalFee()} WEST service fee</Fee>
            </Block>
          </TextTableSecondaryValue>
        </TextTableRow>
      </TextTable>
    </Block>
    <Block marginTop={60}>
      <ButtonsContainer>
        <Button type={'primary'} data-attr={'closeVault-1_continueButton'} disabled={isDisabled} onClick={props.onNextClicked}>
          {buttonText}
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
})
