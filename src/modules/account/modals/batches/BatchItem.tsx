import { Block, Block16 } from '../../../../components/Block'
import React from 'react'
import styled from 'styled-components'
import { IBatch } from '../../../../interfaces'
import { shineBatch } from '../../../../components/Animations'
import { roundNumber } from '../../../../utils'

export const BatchWidth = 153

const Container = styled.div<{ background: string; isActive?: boolean }>`
  box-sizing: border-box;
  width: ${BatchWidth}px;
  min-width: ${BatchWidth}px;
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

// https://codepen.io/viktorstrate/pen/yoBRLy
const SkeletonContainer = styled(Container)`
  background-image: linear-gradient(90deg, #ddd 0px,  #e8e8e8 40px, #ddd 80px);
  background-size: 600px;
  animation: ${shineBatch} 1.6s infinite linear;
  cursor: default;
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

export const BatchSkeleton = () => {
  return <SkeletonContainer background={'gray'} />
}

export const BatchItem = (props: IProps) => {
  const { batch } = props
  return <Container
    isActive={props.isActive}
    background={props.background}
    onClick={props.onClick}
  >
    <BatchTitle>Batch #{props.batchIndex}</BatchTitle>
    <Block16>
      <BatchSubTitle>{roundNumber(batch.eastAmount)} East</BatchSubTitle>
    </Block16>
    <Block marginTop={8}>
      <BatchText>
        West was at {roundNumber(batch.westRate)}$
      </BatchText>
    </Block>
    <Block16>
      <BatchSubTitle>Contains</BatchSubTitle>
      <Block marginTop={8}>
        <BatchText>
          <div>{roundNumber(batch.westAmount)} West</div>
          <div>{roundNumber(batch.usdpAmount)} USDp</div>
        </BatchText>
      </Block>
    </Block16>
  </Container>
}
