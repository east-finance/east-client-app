import { IBatch } from '../../../../interfaces'
import React from 'react'
import styled from 'styled-components'
import { Block, Block16 } from '../../../../components/Block'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { Button } from '../../../../components/Button'
import {
  TextTable,
  TextTableKey,
  TextTablePrimaryValue,
  TextTableRow,
  TextTableSecondaryValue
} from '../../../../components/TextTable'
import { roundNumber } from '../../../../utils'
import useStores from '../../../../hooks/useStores'

export interface IBatchDetailsProps {
  batch: IBatch | null | undefined;
  isVisible: boolean;
  onClose: () => void;
}

const Container = styled.div<{ isVisible: boolean }>`
  position: absolute;
  width: 100%;
  top: 0;
  opacity: 0;
  transform: translate(150px, 650px);
  transition: transform 500ms cubic-bezier(.7,0,.6,1), opacity 500ms;

  ${({ isVisible }) => isVisible && `
    opacity: 1;
    transform: translate(0px, 0px);
  `}
`

const BackToPrimary = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  display: inline-flex;
  padding: 8px 12px;
  margin: 32px auto 0;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: #525252;
  cursor: pointer;
`

const Content = styled.div`
  text-align: center;
`

const Description = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
  color: #0A0606;
  opacity: 0.4;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  > div {
    width: 376px;
    &:not(:first-child) {
      margin-top: 8px;
    }
  }
`

export const PostponeLiquidation = (props: IBatchDetailsProps) => {
  const { batch, isVisible, onClose } = props
  const { configStore } = useStores()
  const westAmount = '5'

  const sendAtomic = async () => {
    const state = await window.WEWallet.publicState()
    console.log('WALLET state', state)
    const { account: { address, publicKey } } = state
    const ownerAddress = configStore.getEastOwnerAddress()
    const eastContractId = configStore.getEastContractId()
    console.log('ownerAddress', ownerAddress)
    console.log('eastContractId', eastContractId)
    const transfer = {
      type: 'transferV3',
      tx: {
        recipient: ownerAddress,
        assetId: 'WAVES',
        amount: +westAmount * Math.pow(10, 8),
        fee: configStore.getTransferFee(),
        attachment: '',
        timestamp: Date.now(),
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transferId = await window.WEWallet.getTxId({ type: 'transferV3', tx: transfer.tx })
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
            transferId: transferId,
            vaultId: batch?.vaultId
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
    console.log('Broadcast supply atomic result:', result)
  }

  const onPostponeClicked = async () => {
    const state = await window.WEWallet.publicState()
    console.log('WALLET state', state)
    if (state.locked) {
      await window.WEWallet.auth({ data: 'EAST Client auth' })
    }
    await sendAtomic()
  }

  const fee = +(configStore.getDockerCallFee() + configStore.getTransferFee() + configStore.getAtomicFee())

  return <Container isVisible={isVisible}>
    {batch &&
    <div style={{ textAlign: 'center' }}>
      <BackToPrimary onClick={onClose}>
        Close and return to batches overview
      </BackToPrimary>
      <Block16 />
      <PrimaryModal>
        <PrimaryTitle>Postpone liquidation</PrimaryTitle>
        <Content>
          <Block marginTop={40}>
            You need to add WEST to the batch in order to postpone liquidation
          </Block>
          <Block marginTop={42}>
            <TextTable>
              <TextTableRow>
                <TextTableKey>Current collateral</TextTableKey>
                <TextTablePrimaryValue>150%</TextTablePrimaryValue>
              </TextTableRow>
              <TextTableRow>
                <TextTableKey>You want to reach</TextTableKey>
                <TextTablePrimaryValue>220%</TextTablePrimaryValue>
              </TextTableRow>
              <TextTableRow>
                <TextTableKey>You will pay</TextTableKey>
                <div>
                  <TextTablePrimaryValue>220%</TextTablePrimaryValue>
                  <Block marginTop={8}>
                    <TextTableSecondaryValue>
                      <div>+ {fee} WEST fee</div>
                    </TextTableSecondaryValue>
                  </Block>
                </div>
              </TextTableRow>
            </TextTable>
          </Block>
          <Block marginTop={38}>
            <ButtonsContainer>
              <Button type={'primary'} onClick={onPostponeClicked}>Postpone liquidation</Button>
            </ButtonsContainer>
          </Block>
        </Content>
      </PrimaryModal>
    </div>
    }
  </Container>
}
