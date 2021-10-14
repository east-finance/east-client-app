import React, { useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { isDesktop } from 'react-device-detect'
import { Block } from '../../../../components/Block'
import { Button, NavigationLeftGradientButton } from '../../../../components/Button'
import { ErrorNotification } from '../../../../components/Notification'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import {
  TextTable,
  TextTableInfo,
  TextTableKey,
  TextTablePrimaryValue,
  TextTableRow,
  TextTableSecondaryValue
} from '../../../../components/TextTable'
import useStores from '../../../../hooks/useStores'
import { EastOpType, TxTextType } from '../../../../interfaces'
import { GradientText } from '../../../../components/Text'
import { roundNumber } from '../../../../utils'
import BigNumber from 'bignumber.js'

interface IProps {
  eastAmount: string;
  westAmount: string;
  onNextClicked: () => void
  onPrevClicked: () => void
}

const Container = styled.div`
  @media screen and (min-width: 900px) {
    width: 376px;
  }
  margin: 0 auto;
`

const SendButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const GradientTextPostfix = styled(GradientText)`
  position: absolute;
  margin-left: 16px;
  font-size: 15px;
  font-weight: 400;
`

export const ConfirmIssueTransaction = (props: IProps) => {
  const { configStore, dataStore, signStore } = useStores()
  const [inProgress, setInProgress] = useState(false)
  const totalFee = +configStore.getFeeByOpType(EastOpType.supply)

  const { vaultFreeWest } = dataStore

  let transferWestAmount = +props.westAmount
  if (vaultFreeWest < 0) {
    transferWestAmount += Math.abs(vaultFreeWest)
  }
  console.log('Supply WEST amount: ', transferWestAmount, 'vault Free West:', vaultFreeWest)
  console.log('Only Reissue tx:',  transferWestAmount <= 0)
  if (transferWestAmount <= 0) {
    console.log(`Reissue  west amount: ${dataStore.exchangeEast(props.eastAmount)}`)
  }

  const sendSupply = async () => {
    const ownerAddress = configStore.getEastServiceAddress()
    const eastContractId = configStore.getEastContractId()
    const { address, publicKey } = await signStore.getPublicData()

    // Vault is over-supplied, and user want to convert FREE WEST to EAST and recalculate vault
    if (transferWestAmount <= 0) {
      const maxWestToExchange = dataStore.calculateWestAmount(props.eastAmount)
      const reissueValue = maxWestToExchange > 0 ? {
        maxWestToExchange: new BigNumber(+maxWestToExchange).multipliedBy(Math.pow(10, 8)).toNumber()
      } : {}
      const reissueTx = {
        senderPublicKey: publicKey,
        authorPublicKey: publicKey,
        contractId: eastContractId,
        contractVersion: configStore.getEastContractVersion(),
        timestamp: Date.now(),
        params: [{
          type: 'string',
          key: 'reissue',
          value: JSON.stringify(reissueValue)
        }],
        fee: configStore.getDockerCallFee(),
        // atomicBadge: {
        //   trustedSender: address
        // }
      }
      console.log('Reissue vault tx:', reissueTx)
      const result = await signStore.broadcastDockerCall(reissueTx)
      console.log('Broadcast Reissue vault result:', result)
    } else {
      const transferBody = {
        recipient: ownerAddress,
        amount: Math.round(transferWestAmount * Math.pow(10, 8)),
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
      console.log('transferId:', transferId)
      const dockerCall = {
        type: TxTextType.dockerCallV4,
        tx: {
          senderPublicKey: publicKey,
          authorPublicKey: publicKey,
          contractId: eastContractId,
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

      if (!(vaultFreeWest < 0 && +transferWestAmount === Math.abs(vaultFreeWest))) {
        const dockerCallReissue = {
          type: TxTextType.dockerCallV4,
          tx: {
            senderPublicKey: publicKey,
            authorPublicKey: publicKey,
            contractId: eastContractId,
            contractVersion: configStore.getEastContractVersion(),
            timestamp: Date.now(),
            params: [{
              type: 'string',
              key: 'reissue',
              value: ''
              // value: JSON.stringify({
              //   // maxWestToExchange: reissueWestAmount
              // })
            }],
            fee: configStore.getDockerCallFee(),
            atomicBadge: {
              trustedSender: address
            }
          }
        }
        transactions.push(dockerCallReissue)
      }
      const result = await signStore.broadcastAtomic(transactions)
      console.log('Broadcast Atomic(Transfer+Supply+Reissue) result:', result)
    }
  }

  const onIssueClicked = async () => {
    try {
      setInProgress(true)
      await sendSupply()
      props.onNextClicked()
    } catch(e) {
      console.error('Send supply + reissue error:', e.message)
      toast(<ErrorNotification title={'Error on issue EAST'} />, {
        hideProgressBar: true
      })
      setInProgress(false)
    }
  }

  return <Container>
    <Block marginTop={'15%'}>
      <TextTable>
        <TextTableRow>
          <TextTableKey>You will get</TextTableKey>
          <TextTablePrimaryValue>
            ~{roundNumber(props.eastAmount)} EAST
            {isDesktop &&
              <GradientTextPostfix>
                <a href={'https://east.finance/faq#howitworks'} target={'_blank'} rel="noreferrer">Why approximate?</a>
              </GradientTextPostfix>
            }
          </TextTablePrimaryValue>
        </TextTableRow>
        <TextTableRow>
          <TextTableKey>You will pay</TextTableKey>
          <div>
            <TextTableSecondaryValue>{roundNumber(transferWestAmount)} WEST</TextTableSecondaryValue>
            {vaultFreeWest < 0 &&
              <Block marginTop={8}>
                <TextTableInfo>
                  Including <GradientText>{Math.abs(vaultFreeWest)} WEST</GradientText> to supply the Vault
                </TextTableInfo>
              </Block>
            }
          </div>
        </TextTableRow>
        {/*<TextTableRow>*/}
        {/*  <TextTableKey>Will be in Vault</TextTableKey>*/}
        {/*  <div>*/}
        {/*    <TextTableSecondaryValue>{expectedVaultWestAmount} WEST</TextTableSecondaryValue>*/}
        {/*    <Block marginTop={8}>*/}
        {/*      <TextTableSecondaryValue>{expectedVaultUSDapAmount} USDap</TextTableSecondaryValue>*/}
        {/*    </Block>*/}
        {/*  </div>*/}
        {/*</TextTableRow>*/}
        <TextTableRow>
          <TextTableKey>Fee</TextTableKey>
          <TextTableSecondaryValue>
            <div>{totalFee} WEST</div>
          </TextTableSecondaryValue>
        </TextTableRow>
      </TextTable>
    </Block>
    <Block marginTop={'15%'}>
      <SendButtonsContainer>
        <NavigationLeftGradientButton data-attr={'issueEast-2_back'} onClick={props.onPrevClicked} />
        <Button
          type={'primary'}
          data-attr={'issueEast-2_continueButton'}
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
