import React, { useState } from 'react'
import styled from 'styled-components'
import { Block } from '../../../../components/Block'
import { Button, NavigationLeftGradientButton } from '../../../../components/Button'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import { TextTable, TextTableKey, TextTablePrimaryValue, TextTableRow, TextTableSecondaryValue } from '../../../../components/TextTable'
import useStores from '../../../../hooks/useStores'
import { EastOpType } from '../../../../interfaces'

interface IProps {
  eastAmount: string;
  westAmount: string;
  onNextClicked: () => void
  onPrevClicked: () => void
}

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
`

const Description = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: #8D8D8D;
`

const SendButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

export const ConfirmIssueTransaction = (props: IProps) => {
  const { configStore } = useStores()
  const [inProgress, setInProgress] = useState(false)
  const totalFee = +configStore.getFeeByOpType(EastOpType.supply)

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
    console.log('transferId', transferId)
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
    const dockerCallReissue = {
      type: 'dockerCallV4',
      tx: {
        senderPublicKey: publicKey,
        authorPublicKey: publicKey,
        contractId: eastContractId,
        contractVersion: 1,
        timestamp: Date.now(),
        params: [{
          type: 'string',
          key: 'reissue',
          value: JSON.stringify({
            maxWestToExchange: +props.westAmount
          })
        }],
        fee: configStore.getDockerCallFee(),
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transactions = [transfer, dockerCall, dockerCallReissue]
    const result = await window.WEWallet.broadcastAtomic(transactions, configStore.getAtomicFee())
    console.log('Broadcast supply+reissue vault result:', result)
  }

  const onIssueClicked = async () => {
    try {
      setInProgress(true)
      await sendSupply()
      props.onNextClicked()
    } catch(e) {
      console.error('Send supply + reissue error:', e.message)
    } finally {
      setInProgress(false)
    }
  }

  return <Container>
    <Block marginTop={58}>
      <TextTable>
        <TextTableRow>
          <TextTableKey>You will get</TextTableKey>
          <TextTablePrimaryValue>~{props.eastAmount} EAST</TextTablePrimaryValue>
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
    <Block marginTop={40}>
      <SendButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
        <Button
          type={'primary'}
          disabled={inProgress}
          style={{ width: '300px' }}
          onClick={onIssueClicked}
        >
          <RelativeContainer>
            {inProgress && <ButtonSpinner />}
            Issue EAST
          </RelativeContainer>
        </Button>
      </SendButtonsContainer>
    </Block>
  </Container>
}
