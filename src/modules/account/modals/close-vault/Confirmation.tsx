import React, { useState } from 'react'
import { Block, Block24 } from '../../../../components/Block'
import styled from 'styled-components'
import { Button, NavigationLeftGradientButton } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import iconWarning from '../../../../resources/images/warning.svg'
import { observer } from 'mobx-react'
import { Icon } from '../../../../components/Icons'
import {
  TextTable,
  TextTableKey,
  TextTablePrimaryValue,
  TextTableRow,
  TextTableSecondaryValue
} from '../../../../components/TextTable'
import { roundNumber } from '../../../../utils'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'

interface IProps {
  inProgress: boolean;
  onPrevClicked: () => void;
  onSuccess: () => void;
}

const Container = styled.div`
  margin: 0 auto;
`

const Description = styled.div`
  font-size: 15px;
  line-height: 20px;
`

const Centered = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  
  > div:not(:first-child) {
    margin-left: 8px;
  }
`

export const CloseVaultConfirmation = observer((props: IProps) => {
  const { dataStore } = useStores()
  const { vault } = dataStore
  const { inProgress } = props

  return <Container>
    <Centered>
      <Block marginTop={40}>
        <Icon backgroundImage={iconWarning} size={80} />
      </Block>
      <div style={{ width: '217px' }}>
        <Block24>
          <Description>
            You are about to close your vault.
            Please double-check and confirm
          </Description>
        </Block24>
      </div>
    </Centered>
    <Block marginTop={38}>
      <TextTable>
        <TextTableRow>
          <TextTableKey>You will pay</TextTableKey>
          <TextTablePrimaryValue>{roundNumber(dataStore.vaultEastAmount, 8)} EAST</TextTablePrimaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>You will unlock</TextTableKey>
          <TextTableSecondaryValue>
            <div>{vault.westAmount} WEST</div>
            {+vault.rwaAmount > 0 &&
              <div>{vault.rwaAmount} USDap</div>
            }
          </TextTableSecondaryValue>
        </TextTableRow>
      </TextTable>
    </Block>
    <Block marginTop={32}>
      <ButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
        <Button type={'primary'} disabled={inProgress} onClick={props.onSuccess} style={{ width: '304px' }}>
          <RelativeContainer>
            {inProgress && <ButtonSpinner />}
            Yes, close my position
          </RelativeContainer>
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
})
