import { IBatch } from '../../../../interfaces'
import React from 'react'
import styled from 'styled-components'
import { Block, Block16 } from '../../../../components/Block'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { BrutalTitle } from '../../../../components/Text'
import { Button } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import data from '@wavesenterprise/js-sdk/raw/src/grpc/transactions/Data'
import { roundNumber } from '../../../../utils'
import { claimOverpay, liquidateVault } from '../../../../utils/txFactory'
import { toast } from 'react-toastify'
import { ErrorNotification } from '../../../../components/Notification'

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

export const ClaimOverpay = (props: IBatchDetailsProps) => {
  const { batch, isVisible, onClose } = props
  const { dataStore, configStore } = useStores()
  let overpayAmount = 0

  if (batch) {
    const currentWestAmount = dataStore.calculateWestAmount({
      usdpPart: configStore.getUsdpPart(),
      westCollateral: configStore.getWestCollateral(),
      westRate: +dataStore.westRate,
      usdapRate: +dataStore.usdapRate,
      inputEastAmount: +batch.eastAmount
    })
    const westDelta = currentWestAmount - +batch.westAmount * 1.4
    if (westDelta > 0) {
      overpayAmount = roundNumber(westDelta.toString(), 4)
    }
  }

  const sendDockerCall = async () => {
    if (batch) {
      // const state = await window.WEWallet.publicState()
      // const { account: { publicKey } } = state
      // if (state.locked) {
      //   await window.WEWallet.auth({ data: 'EAST Client auth' })
      // }
      // const tx = claimOverpay({
      //   publicKey: publicKey,
      //   contractId: configStore.getEastContractId(),
      //   vaultId: batch.vaultId,
      //   fee: configStore.getDockerCallFee()
      // })
      // console.log('Claim overpay Docker call tx:', tx)
      // const result = await window.WEWallet.broadcast('dockerCallV3', tx)
      // console.log('Claim overpay broadcast result:', result)
    }
  }

  const overpayWestClicked = async () => {
    if (batch && overpayAmount > 0) {
      try {
        sendDockerCall()
        toast('Transaction sent!')
      } catch (e) {
        console.error('Eror on send claim overpay', e)
        toast(<ErrorNotification text={'Error on send Claim Overpay'} />, {
          hideProgressBar: true
        })
      }
    }
  }

  return <Container isVisible={isVisible}>
    {batch &&
    <div style={{ textAlign: 'center' }}>
      <BackToPrimary onClick={onClose}>
        Close and return to batches overview
      </BackToPrimary>
      <Block16 />
      <PrimaryModal>
        <PrimaryTitle>Claim overpay</PrimaryTitle>
        <Content>
          <Block marginTop={65}>
            <BrutalTitle>~{overpayAmount} WEST</BrutalTitle>
            <Description>available for claiming</Description>
          </Block>
          <Block marginTop={95}>
            <ButtonsContainer>
              <Button type={'primary'} onClick={overpayWestClicked}>Get {overpayAmount} WEST back</Button>
              {/*<Button type={'primary'}>Add 100 EAST for free</Button>*/}
            </ButtonsContainer>
          </Block>
        </Content>
      </PrimaryModal>
    </div>
    }
  </Container>
}
