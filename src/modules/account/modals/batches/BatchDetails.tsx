import { IBatch } from '../../../../interfaces'
import { CrossIcon } from '../../../../components/Icons'
import React from 'react'
import styled from 'styled-components'
import gradientBackground from '../../../../resources/images/gradient-bg2.png'
import { Block, Block16, Block24 } from '../../../../components/Block'
import { BatchOperation } from '../../../../constants'
import { SecondaryModal, SecondaryModalButton } from '../../Modal'
import moment from 'moment'
import { roundNumber } from '../../../../utils'

export interface IBatchDetailsProps {
  batch: IBatch | null | undefined;
  onOperationClicked: (op: BatchOperation) => void;
  onClose: () => void;
}

const IconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const Title = styled.div`
  font-family: BrutalType,sans-serif;
  font-size: 32px;
  line-height: 48px;
  letter-spacing: -1px;
  text-transform: uppercase;
`

const SubTitle = styled.div`
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: #FFFFFF;
`

const Text = styled.div`
  font-family: Cairo,sans-serif;
  font-size: 15px;
  line-height: 18px;
`

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: inherit;
  color: #FFFFFF;
`

export const BatchDetails = (props: IBatchDetailsProps) => {
  const { batch, onClose } = props
  return <SecondaryModal style={{ visibility: batch ? 'visible' : 'hidden' }}>
    {batch &&
      <FlexWrapper>
        <IconContainer onClick={onClose}>
          <CrossIcon color={'white'} />
        </IconContainer>
        <Block marginTop={139}>
          <Title>{roundNumber(batch.eastAmount)} East</Title>
          <div  style={{ maxWidth: '80px' }}>
            <Block24>
              <Text>West was at {roundNumber(batch.westRate)}$</Text>
            </Block24>
            <Block16>
              <SubTitle>Contains</SubTitle>
              <Block marginTop={8}>
                <Text>{roundNumber(batch.westAmount)} West</Text>
                <Text>{roundNumber(batch.usdpAmount)} USDp</Text>
              </Block>
            </Block16>
          </div>
          <Block16>
            <SubTitle>Created</SubTitle>
            <Block marginTop={8}>
              <Text>{moment(batch.createdAt).format('LLL')}</Text>
            </Block>
          </Block16>
        </Block>
        <div style={{ marginTop: 'auto' }}>
          <SecondaryModalButton style={{ color: '#FDA362' }} onClick={() => props.onOperationClicked(BatchOperation.postponeLiquidation)}>
            Postpone liquidation
          </SecondaryModalButton>
          <Block marginTop={8} />
          <SecondaryModalButton style={{ color: '#62FD84' }} onClick={() => props.onOperationClicked(BatchOperation.overpay)}>
            Claim overpay
          </SecondaryModalButton>
          <Block marginTop={8} />
          <SecondaryModalButton onClick={() => props.onOperationClicked(BatchOperation.liquidate)}>
            Liquidate
          </SecondaryModalButton>
        </div>
      </FlexWrapper>
    }
  </SecondaryModal>
}
