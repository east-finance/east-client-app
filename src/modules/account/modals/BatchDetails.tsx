import { IBatch } from '../../../interfaces'
import { CrossIcon } from '../../../components/Icons'
import React from 'react'
import styled from 'styled-components'
import gradientBackground from '../../../resources/images/gradient-bg2.png'
import { Block, Block16, Block24 } from '../../../components/Block'

export interface IBatchDetailsProps {
  batch: IBatch | null;
  onClose: () => void;
}

const IconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const SecondaryModal = styled.div`
  position: absolute;
  width: 208px;
  padding: 16px;
  box-sizing: border-box;
  left: calc(-208px - 16px);
  height: 100%;
  border-radius: 22px;
  background-image: url(${gradientBackground});
  background-repeat: no-repeat;
  background-size: 120% 100%;
  top: 0;
`

const Title = styled.div`
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 16px;
  color: #FFFFFF;
`

const SubTitle = styled.div`
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: #FFFFFF;
`

export const BatchDetails = (props: IBatchDetailsProps) => {
  const { batch, onClose } = props
  return <SecondaryModal style={{ visibility: batch ? 'visible' : 'hidden' }}>
    {batch &&
      <div>
        <IconContainer onClick={onClose}>
          <CrossIcon color={'white'} />
        </IconContainer>
        <Block marginTop={139}>
          <Title>{batch.eastAmount} East</Title>
          <Block24>
            <SubTitle>In vault</SubTitle>
          </Block24>
          <Block16>
            <SubTitle>Created</SubTitle>
          </Block16>
          <Block16>
            <SubTitle>Changed</SubTitle>
          </Block16>
        </Block>
      </div>
    }
  </SecondaryModal>
}
