import { IBatch } from '../../../../interfaces'
import React from 'react'
import styled from 'styled-components'
import { Block, Block16 } from '../../../../components/Block'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import {
  TextTable,
  TextTableKey,
  TextTablePrimaryValue,
  TextTableRow,
  TextTableSecondaryValue
} from '../../../../components/TextTable'

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
  margin: 16px auto 0;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: #525252;
  cursor: pointer;
`

const Description = styled.div`
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  color: #0A0606;
`

export const BatchLiquidation = (props: IBatchDetailsProps) => {
  const { batch, isVisible, onClose } = props
  return <Container isVisible={isVisible}>
    {batch &&
    <div style={{ textAlign: 'center' }}>
      <BackToPrimary onClick={onClose}>
        Close and return to batches overview
      </BackToPrimary>
      <Block16 />
      <PrimaryModal>
        <PrimaryTitle>batch liquidation</PrimaryTitle>
        <Block marginTop={40}>
          <Description>Give back your EAST to unlock WEST and USDp from your batch</Description>
        </Block>
        <Block marginTop={50}>
          <TextTable>
            <TextTableRow>
              <TextTableKey>Current balance</TextTableKey>
              <TextTablePrimaryValue>120 EAST</TextTablePrimaryValue>
            </TextTableRow>
            <TextTableRow>
              <TextTableKey>You will pay</TextTableKey>
              <TextTablePrimaryValue>100 WEST</TextTablePrimaryValue>
            </TextTableRow>
            <TextTableRow>
              <TextTableKey>You will unlock</TextTableKey>
              <TextTableSecondaryValue>
                <div>300 WEST</div>
                <div>50 USDp</div>
              </TextTableSecondaryValue>
            </TextTableRow>
          </TextTable>
        </Block>
      </PrimaryModal>
    </div>
    }
  </Container>
}
