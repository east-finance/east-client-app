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
import { IVault } from '../../../../interfaces'
import { closeVault } from '../../../../utils/txFactory'

interface IProps {
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
  const { configStore, dataStore } = useStores()
  const vault: IVault = dataStore.vault

  const [inProgress, setInProgress] = useState(false)

  const sendCloseVault = async () => {
    const state = await window.WEWallet.publicState()
    const { account: { publicKey } } = state
    if (state.locked) {
      await window.WEWallet.auth({ data: 'EAST Client auth' })
    }
    const tx = closeVault({
      publicKey: publicKey,
      contractId: configStore.getEastContractId(),
      fee: configStore.getDockerCallFee()
    })
    console.log('Close vault Docker call tx:', tx)
    const result = await window.WEWallet.broadcast('dockerCallV3', tx)
    console.log('Close vault broadcast result:', result)
  }

  const closePosition = async () => {
    try {
      setInProgress(true)
      // await new Promise(resolve => setTimeout(resolve, 2000))
      await sendCloseVault()
      props.onSuccess()
    } catch (e) {
      console.error('Error on close vault', e.message)
    } finally {
      setInProgress(false)
    }
  }

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
      <TextTable style={{ width: '320px' }}>
        <TextTableRow>
          <TextTableKey>You will pay</TextTableKey>
          <TextTablePrimaryValue>{roundNumber(dataStore.vaultEastAmount)} EAST</TextTablePrimaryValue>
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
    <Block marginTop={32}>
      <ButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
        <Button type={'primary'} disabled={inProgress} onClick={closePosition} style={{ width: '304px' }}>
          <RelativeContainer>
            {inProgress && <ButtonSpinner />}
            Yes, close my position
          </RelativeContainer>
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
})
