import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CardBackground from '../../resources/images/card_bg.png'
import { Block } from '../../components/Block'
import { observer } from 'mobx-react'
import useStores from '../../hooks/useStores'
import { formatNumber } from '../../utils'

const Container = styled.div`
  width: 444px;
  height: 260px;
  box-sizing: border-box;
  padding: 52px 72px 16px 32px;
  //background: radial-gradient(97.31% 97.31% at 50% 2.69%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 79%), #000000;
  background-image: url(${CardBackground});
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 0 32px 32px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  filter: drop-shadow(0px 24px 40px rgba(0, 0, 0, 0.4));
  font-family: 'Staatliches',serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const TopContainer = styled.div`

`

const TextShadow = styled.div`
  color: rgba(10,60,150, 0.8);
  text-shadow: 1px 4px 6px #def, 0 0 0 #000, 1px 4px 6px #def;
`

const TokenName = styled.div`
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 2px;
  color: #F8F8F8;
`

const Value = styled.div`
  font-size: 64px;
  line-height: 48px;
  color: #F8F8F8;
  letter-spacing: 3px;
  font-weight: 300;
`

const BottomItem = styled.div`
  color: #FFFFFF;
  font-weight: 300;
  font-size: 18px;
  line-height: 16px;
  letter-spacing: 2px;
`

const BottomContainer = styled.div`

`

export interface IProps {
  eastBalance: string;
}

export const AccountCard = observer((props: IProps) => {
  const { eastBalance } = props
  const { authStore, dataStore } = useStores()
  const { address } = authStore

  const [westBalance, setWestBalance] = useState('')

  useEffect(() => {
    const getBalances = async () => {
      const west = await dataStore.getWestBalance(address)
      setWestBalance(west)
    }
    if (address) {
      getBalances()
    }
  }, [address])

  return <Container>
    <TopContainer>
      <Value>{formatNumber(eastBalance)}</Value>
      <Block marginTop={4}>
        <TokenName>EAST</TokenName>
      </Block>
    </TopContainer>
    {address &&
      <BottomContainer>
        <BottomItem>{address}</BottomItem>
        <Block marginTop={8} />
        <BottomItem>{formatNumber(westBalance) + ' WEST'}</BottomItem>
      </BottomContainer>
    }
  </Container>
})
