import React, { useState } from 'react'
import styled from 'styled-components'
import copy from 'copy-to-clipboard'
import { Block, Block16, Block24 } from '../../../../components/Block'
import { Button, NavigationLeftGradientButton } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import iconCopy from '../../../../resources/images/icon-copy.png'
import { roundNumber } from '../../../../utils'

interface IProps {
  rechargeWestAmount: string;
  eastAmount: string;
  westAmount: string;
  onPrevClicked: () => void;
}

const IconCommon = styled.div`
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 32px;
`

const IconCopy = styled(IconCommon)`
  background-image: url(${iconCopy});
  cursor: pointer;
`

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
  font-family: Cairo,sans-serif;
`

const Centered = styled.div`text-align: center;`

const Description = styled(Centered)`
  font-size: 15px;
  line-height: 18px;
`

const SendButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`

const AddressContainer = styled.div`
  padding: 4px 8px;
  background: rgba(224, 224, 224, 0.75);
  border-radius: 8px;
  font-family: Cairo,sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #0A0606;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const RechargeWest = (props: IProps) => {
  const { authStore } = useStores()
  const onCopyClicked = () => {
    copy(authStore.address)
  }
  return <Container>
    <Block marginTop={40}>
      <Description>
        Add {roundNumber(props.rechargeWestAmount, 4)} WEST to your address to get {props.eastAmount} EAST.
      </Description>
      <Block16>
        <Description>
          Use your address
        </Description>
      </Block16>
      <Block marginTop={24}>
        <AddressContainer>
          <div>{authStore.address}</div>
          <div><IconCopy onClick={onCopyClicked} /></div>
        </AddressContainer>
      </Block>
    </Block>
    <Block16>
      <SendButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
      </SendButtonsContainer>
    </Block16>
  </Container>
}
