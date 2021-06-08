import React from 'react'
import styled from 'styled-components'
import CardBackground from '../../resources/images/card_bg.png'
import NoiseImg from '../../resources/images/noise.png'
import iconPlus from '../../resources/images/plus.png'
import { Block, Block24 } from '../../components/Block'
import { observer } from 'mobx-react'
import useStores from '../../hooks/useStores'
import { roundNumber } from '../../utils'
import { RouteName } from '../../router/segments'
import { useRoute } from 'react-router5'

const Container = styled.div<{ isOutlined?: boolean }>`
  ${({ isOutlined }) => isOutlined && `
    border: 1px solid white;
    border-radius: 6px;
  `}
`

const ContentWrapper = styled.div<{ isActive?: boolean }>`
  width: 444px;
  height: 260px;
  box-sizing: border-box;
  padding: 32px 72px 16px 24px;
  //background: radial-gradient(97.31% 97.31% at 50% 2.69%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 79%), #000000;
  background-image: url(${NoiseImg}), url(${CardBackground});
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 0 32px 32px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  filter: drop-shadow(0px 24px 40px rgba(0, 0, 0, 0.4));
  font-family: 'Staatliches',serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: ${props => props.isActive ? 1 : 0.5};
`

const TopContainer = styled.div`

`

const TokenName = styled.div`
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 2px;
  color: #F8F8F8;
`

const BottomItem = styled.div`
  color: #FFFFFF;
  font-weight: 300;
  font-size: 18px;
  line-height: 16px;
  letter-spacing: 2px;
`

const BottomContainer = styled.div`
  margin-left: 8px;
`

const PlusContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
  width: 100%;
  cursor: pointer;
  text-align: center;
  z-index: 1;
`

const PlusImage = styled.div`
  margin: 0 auto;
  width: 80px;
  height: 80px;
  background-repeat: no-repeat;
  background-size: 80px;
  background-image: url(${iconPlus});
  transition: transform 250ms;

  :hover {
    transform: scale(1.1);
  }
`

const AddEast = styled.div`
  font-family: Staatliches;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #FFFFFF;
  text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.25);
`

interface IEastBalanceProps {
  value: string;
}

const IntegerPart = styled.span`
  font-size: 64px;
  line-height: 48px;
  color: #F8F8F8;
  letter-spacing: 3px;
  font-weight: 300;
`

const FracPart = styled.span`
  font-size: 32px;
  line-height: 28px;
  color: #F8F8F8;
  letter-spacing: 3px;
  font-weight: 300;
  margin-left: 4px;
`

const EastBalance = (props: IEastBalanceProps) => {
  const { value } = props
  const [integerPart, fractionalPart] = roundNumber(value).toString().split('.')
  return <div>
    <IntegerPart>{integerPart}</IntegerPart>
    {fractionalPart &&
      <FracPart>,{fractionalPart.slice(0, 2)}</FracPart>
    }
  </div>
}

export const AccountCard = observer(() => {
  const { router } = useRoute()
  const { authStore, dataStore } = useStores()
  const { address } = authStore

  const { westBalance, eastBalance } = dataStore
  const isPositiveBalance = parseInt(eastBalance) > 0

  return <Container isOutlined={!isPositiveBalance}>
    {!isPositiveBalance &&
      <PlusContainer>
        <PlusImage onClick={() => router.navigate(RouteName.BuyEast)}/>
        <Block24>
          <AddEast onClick={() => router.navigate(RouteName.BuyEast)}>Issue East</AddEast>
        </Block24>
      </PlusContainer>
    }
    <ContentWrapper isActive={isPositiveBalance}>
      <TopContainer>
        <EastBalance value={eastBalance} />
        <Block marginTop={4}>
          <TokenName>EAST</TokenName>
        </Block>
      </TopContainer>
      {address &&
        <BottomContainer>
          <BottomItem>{address}</BottomItem>
          <Block marginTop={8} />
          <BottomItem>{roundNumber(westBalance) + ' WEST'}</BottomItem>
        </BottomContainer>
      }
    </ContentWrapper>
  </Container>
})
