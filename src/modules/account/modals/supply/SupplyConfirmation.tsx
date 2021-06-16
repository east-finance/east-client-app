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
import { EastOpType, IVault } from '../../../../interfaces'
import { closeVault } from '../../../../utils/txFactory'

interface IProps {
  westAmount: string;
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

export const SupplyConfirmation = observer((props: IProps) => {
  const { configStore, dataStore } = useStores()
  const vault: IVault = dataStore.vault

  const [inProgress, setInProgress] = useState(false)

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
    <Block marginTop={124}>
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
    <Block marginTop={132}>
      <ButtonsContainer>
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
