import React, { useState } from 'react'
import styled from 'styled-components'
import { Block, Block32 } from '../../../../components/Block'
import { Button } from '../../../../components/Button'
import ArrowLeft from '../../../../resources/images/arrow-left.svg'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import { CollateralCircle, CollateralCircle2 } from '../../../../components/CollateralCircle'
import useStores from '../../../../hooks/useStores'
import { roundNumber } from '../../../../utils'
import { useRoute } from 'react-router5'
import { RouteName } from '../../../../router/segments'
import { IVault } from '../../../../interfaces'

export interface IProps {
  westAmount: number;
  vaultCollateral: number;
  onSuccess: () => void;
}

const Container = styled.div`
  font-size: 15px;
  line-height: 20px;
  font-family: Cairo;
`

const Centered = styled.div`
  width: 208px;
  margin: 0 auto;
  text-align: center;
`

const Collaterals = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Arrow = styled.div`
  width: 42px;
  height: 42px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  mask-image: url(${ArrowLeft});
  background-color: ${props => props.theme.darkBlue};
  transform: rotate(180deg);
`

const ButtonContainer = styled.div`
  width: 304px;
  margin: 0 auto;
`

export const SupplyCollateral = (props: IProps) => {
  const { dataStore, configStore } = useStores()
  const [inProgress, setInProgress] = useState(false)
  const [isMining, setIsMining] = useState(false)

  const sendSupply = async () => {
    const state = await window.WEWallet.publicState()
    const { account: { address, publicKey } } = state
    const ownerAddress = configStore.getEastOwnerAddress()
    const eastContractId = configStore.getEastContractId()
    if (state.locked) {
      await window.WEWallet.auth({ data: 'EAST Client auth' })
    }
    const transfer = {
      type: 'transferV3',
      tx: {
        recipient: ownerAddress,
        assetId: 'WAVES',
        amount: +props.westAmount * Math.pow(10, 8),
        fee: configStore.getTransferFee(),
        attachment: '',
        timestamp: Date.now(),
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transferId = await window.WEWallet.getTxId('transferV3', transfer.tx)
    const dockerCall = {
      type: 'dockerCallV4',
      tx: {
        senderPublicKey: publicKey,
        authorPublicKey: publicKey,
        contractId: eastContractId,
        contractVersion: 1,
        timestamp: Date.now(),
        params: [{
          type: 'string',
          key: 'supply',
          value: JSON.stringify({
            transferId: transferId
          })
        }],
        fee: configStore.getDockerCallFee(),
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transactions = [transfer, dockerCall]
    const result = await window.WEWallet.broadcastAtomic(transactions, configStore.getAtomicFee())
    console.log('Broadcast supply vault result:', result)
  }

  const addWest = async () => {
    try {
      setInProgress(true)
      await sendSupply()
      setIsMining(true)
      await new Promise(resolve => setTimeout(resolve, 10000))
      props.onSuccess()
    } catch (e) {
      console.error('Supply collateral error:', e.message)
    } finally {
      setInProgress(false)
      setIsMining(false)
    }
  }

  const buttonText = isMining ? 'Waiting for confirmation...' : `Add ${props.westAmount} WEST and continue`

  return <Container>
    <Block marginTop={40}>
      <Collaterals>
        <CollateralCircle percent={Math.floor(props.vaultCollateral * 100)} />
        <Arrow />
        <CollateralCircle percent={250} />
      </Collaterals>
    </Block>
    <Block32>
      <Centered>Collaterization leveling required.</Centered>
      <Centered>Add {props.westAmount} WEST into the Vault.</Centered>
      <Centered>On wallet: {roundNumber(dataStore.westBalance, 8)} WEST.</Centered>
    </Block32>
    <Block marginTop={28}>
      <ButtonContainer>
        <Button type={'primary'} disabled={inProgress} onClick={addWest}>
          <RelativeContainer>
            {inProgress && <ButtonSpinner />}
            {buttonText}
          </RelativeContainer>
        </Button>
      </ButtonContainer>
    </Block>
  </Container>
}
