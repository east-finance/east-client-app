import React from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import CardBackground from '../../resources/images/card_bg.png'
import { PrimaryModal } from '../Modal'
import { Block, Block16 } from '../../../components/Block'
import { IBatch } from '../../../interfaces'

interface IProps {
  onClose: () => void
}

const Description = styled.div`
  margin: 0 auto;
  max-width: 500px;
  font-family: Montserrat,sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
`

const BatchesItemsContainer = styled.div`
  position: relative;
  display: flex;
  overflow: auto;
  width: calc(100% + 60px); // 60px = parent padding
  
  //::after {
  //  content: "";
  //  position: absolute;
  //  width: 100%;
  //  height: 100%;
  //  box-shadow: inset -24px 0 16px -8px white;
  //}
`

const BatchItem = styled.div<{ background: string }>`
  width: 153px;
  min-width: 153px;
  height: 194px;
  background: ${props => props.background};
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  margin-right: 16px;
`

const BatchTitle = styled.div`
  font-family: Cairo;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 16px;
  color: #000000;
`

const BatchSubTitle = styled.div`
  font-family: Cairo;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: #000000;
`

const BatchText = styled.div`
  font-family: Cairo;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 16px;
  color: #000000;
  max-width: 70px;
`

const gradients = [{
  background: 'linear-gradient(180deg, #F2F2F2 0%, #EDEDED 100%);'
}, {
  background: 'radial-gradient(114.95% 114.95% at 5.23% -14.95%, #2CFF5A 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, #F2F2F2 0%, #EDEDED 100%);'
}, {
  background: 'radial-gradient(114.95% 114.95% at 5.23% -14.95%, #FF842C 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, #F2F2F2 0%, #EDEDED 100%);'
}]

export const Batches = (props: IProps) => {
  const batches: IBatch[] = [{
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
  }]
  return <PrimaryModal {...props}>
    <PrimaryTitle>Batches</PrimaryTitle>
    <Block marginTop={40} />
    <Description>
      Batches are roughly like transaction history. Each batch has a vault with blocked WEST and USDp. Read more
    </Description>
    <Block marginTop={72} />
    <BatchesItemsContainer>
      {batches.map((batch, index) => {
        const grad = gradients[index % gradients.length]
        return <BatchItem key={index} background={grad.background}>
          <BatchTitle>{batch.eastAmount} East</BatchTitle>
          <Block16 />
          <BatchText>
            112 West
            at 0.2253$
          </BatchText>
          <Block16 />
          <BatchSubTitle>In vault</BatchSubTitle>
          <Block marginTop={8} />
          <BatchText>
            112 West
            at 0.2253$
          </BatchText>
        </BatchItem>
      })}
    </BatchesItemsContainer>
    <Block marginTop={72}></Block>
  </PrimaryModal>
}
