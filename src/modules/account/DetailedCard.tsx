import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { roundNumber, spacifyNumber } from '../../utils'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { Block } from '../../components/Block'
import { Button } from '../../components/Button'
import { useRoute } from 'react-router5'
import { RouteName } from '../../router/segments'

type IsShown = null | boolean

const aniTime = '750ms'
const bezier = 'ease'

const FadeInBack = keyframes`
  from{transform: scale(0.7); opacity: 0;}
  to{transform: scale(0.9); opacity: 1;}
`

const CollateralFill = keyframes`
  from{right: 100%;}
  to{right: 30%;}
`

const CollateralTextHide = keyframes`
  from {opacity: 1; transform: scale(1); width: auto;}
  to{opacity: 0; transform: scale(0.8); width: 0;}
`

const CollateralTextShow = keyframes`
  from{opacity: 0; transform: scale(0.8); width: 0;}
  to {opacity: 1; transform: scale(1); width: auto;}
`

const BackToFront = keyframes`
  from {transform: scale(0.9,0.9);}
  to {transform: scale(1,1);z-index:10;}
`

const BackToBackAgain = keyframes`
  from {z-index:10; transform: scale(1,1)}
  51% {z-index:-1;}
  to {transform: scale(0.9,0.9);}
`

const animationCondition = (isShown: IsShown) => {
  if (isShown === true) {
    return css`${BackToFront} ${aniTime} ${bezier} forwards`
  } else if(isShown === false) {
    return css`${BackToBackAgain} ${aniTime} ${bezier} forwards`
  } else {
    return css`${FadeInBack} 650ms ease forwards;`
  }
}

const titleAnimationCondition = (isShown: IsShown) => {
  if (isShown === true) {
    return css`${CollateralTextShow} 600ms ease forwards`
  } else if(isShown === false) {
    return css`${CollateralTextHide} 600ms ease forwards`
  } else {
    return 'none'
    // return css`${FadeIn} 650ms ease forwards;`
  }
}

const Container = styled.div<{ isShown: IsShown }>`
  width: 444px;
  height: 268px;
  box-sizing: border-box;
  position: absolute;
  z-index: -10;
  bottom: -56px;
  transform: scale(0.9);
  overflow: hidden;
  border-radius: 10px;

  animation: ${props => animationCondition(props.isShown)}
`

const DetailsBody = styled.div`
  height: 220px;
  padding: 24px;
  box-sizing: border-box;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 24px 40px rgba(0, 0, 0, 0.4);
`

const ProgressBar = styled.div<{ gradientSteps: string[]; percent: number; }>`
  display: flex;
  align-items: center;
  width: ${props => props.percent}%;
  height: inherit;
  background: linear-gradient(90deg, ${props => props.gradientSteps[0]} 0%, ${props => props.gradientSteps[1]} 100%);
  border-bottom-left-radius: 6px;
`

const NoCollateralWrapper = styled.div`
  width: 100%;
  height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CollateralValue = styled.div<{ isShown?: null | boolean }>`
  padding-left: 24px;
  font-family: Staatliches;
  font-weight: 400;
  font-size: 18px;
  line-height: 36px;
  color: #FFFFFF;
`

const Text = styled.span<{ isShown?: null | boolean }>`
  font-size: 18px;
  line-height: 16px;
  font-family: Staatliches;
  color: #000000;
  opacity: 0.5;
  letter-spacing: 3px;
  font-weight: 300;
  text-transform: uppercase;
`

const PrimaryText = styled(Text)`
    opacity: 1;
`

const SmallButtonContainer = styled.div`
  width: 104px;
  display: inline-block;
  vertical-align: text-top;
  :not(:first-child) {
    margin-left: 16px;
  }
`

const ProgressBarWrapper  = styled.div<{ percent: number, gradientSteps: string[], isShown: IsShown }>`
  font-family: Staatliches;
  transition: padding 600ms ease;
  height: 48px;
  background-color: #C0C0BA;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 195px;
  font-size: 18px;
  
  ${({ isShown }) => isShown && `
    padding-left: 24px;
  `}
  
  ${({ percent }) => (percent === 0) && `
    padding-left: 170px;
  `}
  
  &::before {
    z-index: 1;
    position: absolute;
    content: '';
    left: 0%;
    top: 0%;
    bottom: 0%;
    right: ${props => Math.ceil(100 - props.percent)}%;
    transition: right 800ms ease forwards;
    // animation: ${CollateralFill} 800ms ease forwards;
    background: linear-gradient(90deg, ${props => props.gradientSteps[0]} 0%, ${props => props.gradientSteps[1]} 100%);
    box-shadow: 0px 4px 12px ${props => props.gradientSteps[1]};
  }
`

const ProgressBarText = styled.div`
  z-index: 100;
  display: flex;
  justify-content: center;
  color: white;
`

const Percent = styled.div``

const Title = styled.div<{ isShown: IsShown }>`
  margin-left: 8px;
  transform: scale(0);
  animation: ${props => titleAnimationCondition(props.isShown)}
`

const FreeEastText = styled.div`
  color: rgba(4, 53, 105, 0.5);
  width: 92px;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
`

const StaticTitle = styled.div``

const CardFooter = (props: { vaultCollateral: number, isShown: null | boolean }) => {
  const { configStore } = useStores()
  const defaultCollateral = configStore.getWestCollateral()
  // const  liquidationCollateral = configStore.getLiquidationCollateral()
  const { vaultCollateral } = props

  let gradientSteps = ['#00800D', '#00805E'] // 250% collateral
  // const gradientPercent = Math.round(((vaultCollateral - liquidationCollateral) / (defaultCollateral - liquidationCollateral)) * 100)
  const gradientPercent = Math.round(vaultCollateral / defaultCollateral * 100)
  if (vaultCollateral >= 2.55) {
    gradientSteps = ['#00800D', '#00805E']
  } else if (vaultCollateral <= 2.45 && vaultCollateral > 1.7) {
    gradientSteps = ['#DE6A00', '#DE9000']
  } else if (vaultCollateral <= 1.7) {
    gradientSteps = ['#F0212B', '#F0212B']
  }

  const title = vaultCollateral > 0
    ? <Title isShown={props.isShown}>collateral</Title>
    : <StaticTitle>no collateral</StaticTitle>

  return <ProgressBarWrapper percent={gradientPercent} isShown={props.isShown} gradientSteps={gradientSteps}>
    <ProgressBarText>
      {vaultCollateral > 0 &&
        <Percent>{Math.round(vaultCollateral * 100)}%</Percent>
      }
      {title}
    </ProgressBarText>
  </ProgressBarWrapper>
}

export const DetailedCard = observer((props: { isShown: null | boolean, onClick: (e: any) => void }) => {
  const { router } = useRoute()
  const { dataStore, authStore } = useStores()
  const { address } = authStore
  const { westBalance, vaultCollateral, vaultEastProfit } = dataStore
  const { eastAmount: freeEastAmount } = vaultEastProfit
  return <Container {...props}>
    <DetailsBody>
      <div>
        <PrimaryText>{address}</PrimaryText>
        <Block marginTop={0}>
          <Text>current address</Text>
        </Block>
      </div>
      <Block marginTop={24}>
        <div>
          <PrimaryText>{spacifyNumber(westBalance)}</PrimaryText>
          <Block marginTop={0}>
            <Text>west balance</Text>
          </Block>
        </div>
      </Block>
      <Block marginTop={16}>
        <SmallButtonContainer>
          <Button
            size={'small'}
            style={{ color: '#FFFFFF', background: 'rgba(4, 53, 105, 0.15)' }}
            onClick={() => router.navigate(RouteName.SupplyVault)}
          >
            Add WEST
          </Button>
        </SmallButtonContainer>
        <SmallButtonContainer>
          <Button
            size={'small'}
            style={{ color: '#FFFFFF', background: 'linear-gradient(90deg, #5352B8 0%, #323177 100%)' }}
            onClick={() => router.navigate(RouteName.AddEast)}
          >
            Issue EAST
          </Button>
        </SmallButtonContainer>
        {freeEastAmount > 0 &&
          <SmallButtonContainer>
            <FreeEastText>
              {roundNumber(freeEastAmount, 1)} free EAST available
            </FreeEastText>
          </SmallButtonContainer>
        }
      </Block>
    </DetailsBody>
    <CardFooter vaultCollateral={vaultCollateral} isShown={props.isShown} />
  </Container>
})
