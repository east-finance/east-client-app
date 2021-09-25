import React, { useState } from 'react'
import { Block } from '../../../../components/Block'
import styled from 'styled-components'
import { Button, NavigationLeftGradientButton } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import { observer } from 'mobx-react'
import {
  TextTable,
  TextTableKey,
  TextTableRow,
  TextTableSecondaryValue
} from '../../../../components/TextTable'
import { roundNumber } from '../../../../utils'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import { EastOpType, TxTextType } from '../../../../interfaces'

interface IProps {
  westAmount: string;
  onPrevClicked: () => void;
  onSuccess: () => void;
}

const Container = styled.div`
  margin: 0 auto;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  
  > div:not(:first-child) {
    margin-left: 8px;
  }
`

export const SupplyConfirmation = observer((props: IProps) => {
  const { configStore, dataStore, signStore } = useStores()
  const { vault } = dataStore

  const [inProgress, setInProgress] = useState(false)

  const sendSupply = async () => {
    const { address, publicKey } = await signStore.getPublicData()
    const transferBody = {
      recipient: configStore.getEastServiceAddress(),
      amount: Math.round(+props.westAmount * Math.pow(10, 8)),
      fee: configStore.getTransferFee(),
      attachment: '',
      timestamp: Date.now(),
      atomicBadge: {
        trustedSender: address
      }
    }
    const transfer = {
      type: TxTextType.transferV3,
      tx: transferBody
    }
    const transferId = await signStore.getTransferId(transferBody)
    const dockerCall = {
      type: TxTextType.dockerCallV4,
      tx: {
        senderPublicKey: publicKey,
        authorPublicKey: publicKey,
        contractId: configStore.getEastContractId(),
        contractVersion: configStore.getEastContractVersion(),
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
    const result = await signStore.broadcastAtomic(transactions)
    console.log('Broadcast SUPPLY vault result:', result)
  }

  const onAddWestClicked = async () => {
    try {
      setInProgress(true)
      await sendSupply()
      props.onSuccess()
    } catch (e) {
      console.error('Error on close vault', e.message)
    } finally {
      setInProgress(false)
    }
  }

  const totalWestInVault = +props.westAmount + +vault.westAmount
  const fee = configStore.getFeeByOpType(EastOpType.supply)

  return <Container>
    <Block marginTop={80}>
      <TextTable style={{ width: '320px' }}>
        <TextTableRow>
          <TextTableKey>You will add</TextTableKey>
          <TextTableSecondaryValue>{roundNumber(props.westAmount, 8)} WEST</TextTableSecondaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>Will be in vault</TextTableKey>
          <TextTableSecondaryValue>
            <div>{roundNumber(totalWestInVault, 8)} WEST</div>
          </TextTableSecondaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>Fee</TextTableKey>
          <TextTableSecondaryValue>
            <div>{fee} WEST</div>
          </TextTableSecondaryValue>
        </TextTableRow>
      </TextTable>
    </Block>
    <Block marginTop={80}>
      <ButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
        <Button type={'primary'} disabled={inProgress} onClick={onAddWestClicked} style={{ width: '304px' }}>
          <RelativeContainer>
            {inProgress && <ButtonSpinner />}
            Add WEST
          </RelativeContainer>
        </Button>
      </ButtonsContainer>
    </Block>
  </Container>
})
