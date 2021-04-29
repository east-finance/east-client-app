import { IBatch } from '../../../../interfaces'
import React from 'react'
import styled from 'styled-components'
import { Block, Block16 } from '../../../../components/Block'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { BrutalTitle } from '../../../../components/Text'
import { Button } from '../../../../components/Button'

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
  const overpayAmount = 722
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
            <BrutalTitle>{overpayAmount} WEST</BrutalTitle>
            <Description>available for claiming</Description>
          </Block>
          <Block marginTop={95}>
            <ButtonsContainer>
              <Button>Get 722 WEST back</Button>
              <Button type={'primary'}>Add 100 EAST for free</Button>
            </ButtonsContainer>
          </Block>
        </Content>
      </PrimaryModal>
    </div>
    }
  </Container>
}
