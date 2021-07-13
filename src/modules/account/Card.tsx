import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import CardBackground from '../../resources/images/card-dark-back.jpeg'
import NoiseImg from '../../resources/images/noise.png'
import iconPlus from '../../resources/images/plus.png'
import eastLogoSmall from '../../resources/images/east-logo-small.png'
import { Block, Block24 } from '../../components/Block'
import { observer } from 'mobx-react'
import useStores from '../../hooks/useStores'
import { roundNumber, spacifyFractional, spacifyNumber } from '../../utils'
import { RouteName } from '../../router/segments'
import { useRoute } from 'react-router5'
import { Icon } from '../../components/Icons'

const FrontToFrontAgain = keyframes`
  from {transform: translate(0,0) scale(0.9,0.9);z-index:-1}
  53% {transform: translate(0,-250px) scale(0.9,0.9);z-index:10;}
  to {transform: translate(0,0) scale(1,1);z-index:10;}
`

const FrontToBack = keyframes`
  from {transform: translate(0,0) scale(1,1);}
  50% {transform: translate(0,-250px) scale(0.9,0.9);}
  to {transform: translate(0,0)  scale(0.9,0.9);}
`

const aniTime = '750ms'
const bezier = 'ease'

const animationCondition = (isShown: null | boolean) => {
  if (isShown === true) {
    return css`${FrontToFrontAgain} ${aniTime} ${bezier} forwards`
  } else if(isShown === false) {
    return css`${FrontToBack} ${aniTime} ${bezier} forwards`
  } else {
    return 'none'
  }
}

const Container = styled.div<{ isOutlined?: boolean, isShown: null | boolean }>`
  position: relative;
  ${({ isOutlined }) => isOutlined && `
    border: 1px solid white;
    border-radius: 6px;
  `}

  animation: ${props => animationCondition(props.isShown)}
`

const ContentWrapper = styled.div`
  width: 444px;
  height: 260px;
  box-sizing: border-box;
  padding: 32px 72px 24px 24px;
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
`

const TopContainer = styled.div``

const Description = styled.div`
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 2px;
  color: #F8F8F8;
`

const BottomItem = styled.div`
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 2px;
  color: #F8F8F8;
  font-weight: 300;
  text-transform: uppercase;
`

const BottomContainer = styled.div`
`

const FlexColumnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  
  > div {
    width: 40%;
  }
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

const EastLogoSmall = styled(Icon)`
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
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
  const match = value.toString().match(/[.,]/)
  const separator = match ? match[0] : ''
  // eslint-disable-next-line prefer-const
  let [integerPart, fractionalPart] = value.toString().split(separator)
  if (fractionalPart) {
    fractionalPart = spacifyFractional(fractionalPart)
  }
  return <div>
    <IntegerPart>{integerPart}</IntegerPart>
    {fractionalPart &&
      <FracPart>,{fractionalPart.slice(0, 8)}</FracPart>
    }
  </div>
}

export const AccountCard = observer((props: { isShown: null | boolean, onClick: (e: any) => void }) => {
  const { router } = useRoute()
  const { authStore, dataStore } = useStores()
  const { address } = authStore

  const { westBalance, eastBalance, vault } = dataStore
  const isPositiveBalance = +eastBalance > 0 || +vault.eastAmount > 0

  return <Container {...props} isOutlined={false}>
    <EastLogoSmall backgroundImage={eastLogoSmall} size={50} />
    {!isPositiveBalance &&
      <PlusContainer>
        <PlusImage onClick={() => router.navigate(RouteName.BuyEast)}/>
        <Block24>
          <AddEast onClick={() => router.navigate(RouteName.BuyEast)}>Issue East</AddEast>
        </Block24>
      </PlusContainer>
    }
    <ContentWrapper>
      {isPositiveBalance &&
        <TopContainer>
          <EastBalance value={eastBalance} />
          <Block marginTop={12}>
            <Description>EAST available</Description>
          </Block>
        </TopContainer>
      }
      {isPositiveBalance &&
        <BottomContainer>
          <div>
            <BottomItem>{spacifyNumber(vault.eastAmount)}</BottomItem>
            <Block marginTop={4}>
              <BottomItem>EAST issued with vault</BottomItem>
            </Block>
          </div>
          <FlexColumnWrapper style={{ marginTop: '16px' }}>
            <div>
              <BottomItem>{spacifyNumber(vault.westAmount)}</BottomItem>
              <Block marginTop={4}>
                <BottomItem>west in vault</BottomItem>
              </Block>
            </div>
            <div>
              <BottomItem>{spacifyNumber(vault.rwaAmount)}</BottomItem>
              <Block marginTop={4}>
                <BottomItem>usdap in vault</BottomItem>
              </Block>
            </div>
          </FlexColumnWrapper>
        </BottomContainer>
      }
    </ContentWrapper>
  </Container>
})
