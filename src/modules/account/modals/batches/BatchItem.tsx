import { Block, Block16 } from '../../../../components/Block'
import React from 'react'
import styled from 'styled-components'
import { IBatch } from '../../../../interfaces'

export const BatchWidth = 153

const Container = styled.div<{ background: string; batchWidth: number; isActive?: boolean }>`
  box-sizing: border-box;
  width: ${props => props.batchWidth}px;
  min-width: ${props => props.batchWidth}px;
  height: 210px;
  background: ${props => props.background};
  padding: 16px;
  cursor: pointer;
  margin-right: 16px;
  border: 1px solid white;
  border-radius: 4px;
  transition: margin-bottom 250ms ease, filter 500ms ease;
  
  // &:hover {
  //   margin-bottom: ${props => props.isActive ? '28' : '8'}px;
  // }

  ${({ isActive }) => isActive && `
    margin-bottom: 28px;
    border-image-slice: 1;
    border-image-source: linear-gradient(to right, #3f3e7e, #d96855);
    filter: drop-shadow(-6px 10px 21px rgba(89, 104, 198, 0.4));
  `}
`

const BatchTitle = styled.div`
  font-family: Cairo,sans-serif;
  font-weight: bold;
  font-size: 20px;
  line-height: 16px;
  color: #000000;
`

const BatchSubTitle = styled.div`
  font-family: Cairo,sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: #000000;
`

const BatchText = styled.div`
  font-family: Cairo,sans-serif;
  font-weight: normal;
  font-size: 15px;
  line-height: 16px;
  color: #000000;
  max-width: 70px;
`

interface IProps {
  batch: IBatch;
  batchIndex: number;
  background: string;
  isActive: boolean;
  onClick: () => void;
}

export const BatchItem = (props: IProps) => {
  const { batch } = props
  return <Container
    isActive={props.isActive}
    background={props.background}
    batchWidth={BatchWidth}
    onClick={props.onClick}
  >
    <BatchTitle>Batch #{props.batchIndex}</BatchTitle>
    <Block16>
      <BatchSubTitle>{batch.eastAmount} East</BatchSubTitle>
    </Block16>
    <Block marginTop={8}>
      <BatchText>
        West was at {batch.westRate}
      </BatchText>
    </Block>
    <Block16>
      <BatchSubTitle>Contains</BatchSubTitle>
      <Block marginTop={8}>
        <BatchText>
          <div>{batch.westAmount} West</div>
          <div>{batch.usdpAmount} USDp</div>
        </BatchText>
      </Block>
    </Block16>
  </Container>
}
