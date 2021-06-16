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
import { roundNumber } from '../../../../utils'
import { observer } from 'mobx-react'
import { EastOpType, IVault } from '../../../../interfaces'

interface IProps {
  onNextClicked: () => void;
}

const Container = styled.div`
  margin: 0 auto;
  width: 400px;
`

const ButtonsContainer = styled.div`
  width: 304px;
  margin: 0 auto;
`

const Description = styled.div`
  font-size: 15px;
  line-height: 20px;
`

const Fee = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
  color: ${props => props.theme.darkBlue50}
`

export const CloseVaultInfo = observer((props: IProps) => {
  const { configStore, dataStore } = useStores()
  const vault: IVault = dataStore.vault

  const totalFee = +configStore.getFeeByOpType(EastOpType.close_init)

  return <Container>
    <Block marginTop={40}>
      <Description>
        Give back your EAST to unlock WEST and USDp from your batch
      </Description>
    </Block>
    <Block marginTop={60}>
      <TextTable>
        <TextTableRow>
          <TextTableKey>You have</TextTableKey>
          <TextTablePrimaryValue>{vault.eastAmount} EAST</TextTablePrimaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>You will pay</TextTableKey>
          <TextTablePrimaryValue>
            <div>{vault.eastAmount} EAST</div>
            <Block marginTop={8}>
              <Fee>+ {totalFee} WEST fee</Fee>
            </Block>
          </TextTablePrimaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>You will unlock</TextTableKey>
          <TextTableSecondaryValue>
            <div>{vault.westAmount} WEST</div>
            <div>{vault.usdpAmount} USDap</div>
          </TextTableSecondaryValue>
        </TextTableRow>
      </TextTable>
    </Block>
    <Block marginTop={60}>
      <ButtonsContainer>
        <Button type={'primary'} onClick={props.onNextClicked}>
          Continue to confirmation
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
})
