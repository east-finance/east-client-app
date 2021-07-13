import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { roundNumber, spacifyNumber } from '../../utils'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { Block } from '../../components/Block'
import { Button } from '../../components/Button'
import { useRoute } from 'react-router5'
import { RouteName } from '../../router/segments'

const aniTime = '1000ms'
const bezier = 'ease'

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

const FadeIn = keyframes`
  from{transform: scale(0.7); opacity: 0;}
  to{transform: scale(0.9); opacity: 1;}
`

const animationCondition = (isShown: null | boolean) => {
  if (isShown === true) {
    return css`${BackToFront} ${aniTime} ${bezier} forwards`
  } else if(isShown === false) {
    return css`${BackToBackAgain} ${aniTime} ${bezier} forwards`
  } else {
    // return 'none'
    return css`${FadeIn} 650ms ease forwards;`
  }
}

const textAnimationCondition = (isShown?: null | boolean) => {
  if (isShown === true) {
    return css`${CollateralTextShow} ${aniTime} ${bezier} forwards`
  } else if(isShown === false) {
    return css`${CollateralTextHide} ${aniTime} ${bezier} forwards`
  } else {
    return 'none'
    // return css`${FadeIn} 650ms ease forwards;`
  }
}

const Container = styled.div<{ isShown: null | boolean }>`
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

enum EastBalanceType {
  default = 'default',
  small = 'small'
}

interface IEastBalanceProps {
  value: string;
  postfix?: string;
  type: EastBalanceType;
  style?: any;
}

const EastBalanceContainer = styled.div`
  font-family: Cairo;
  line-height: 100%;
`

const IntegerPart = styled.span<{ type: EastBalanceType }>`
  font-weight: 600;
  font-size: ${props => props.type === EastBalanceType.default ? '40px' : '20px'};
  color: ${props => props.theme.darkBlue};
`
const FracPart = styled.span<{ type: EastBalanceType }>`
  font-size: ${props => props.type === EastBalanceType.default ? '24px' : '20px'};
  font-weight: ${props => props.type === EastBalanceType.default ? '400' : '300'};
  color: ${props => props.theme.darkBlue50};
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
  
  animation: ${props => textAnimationCondition(props.isShown)}
`

const PrimaryText = styled(Text)`
    opacity: 1;
`

const SmallButtonContainer = styled.div`
  width: 104px;
  display: inline-block;
  :not(:first-child) {
    margin-left: 16px;
  }
`

const ProgressBarWrapper  = styled.div<{ gradientSteps: string[]; }>`
  font-family: Staatliches;
  transition: padding 600ms ease;
  height: 48px;
  background-color: #C0C0BA;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 195px;
  
  &::before {
    z-index: 1;
    position: absolute;
    content: '';
    left: 0%;
    top: 0%;
    bottom: 0%;
    right: 100%;
    animation: ${CollateralFill} 800ms ease forwards;
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

const Percent = styled.div`
  
`

const Title = styled.div`
  margin-left: 8px;
  transform: scale(0);
`

const CardFooter = (props: { vaultCollateral: number, isShown: null | boolean }) => {
  const { configStore } = useStores()
  const defaultCollateral = configStore.getWestCollateral()
  // const  liquidationCollateral = configStore.getLiquidationCollateral()
  const { vaultCollateral } = props

  let gradientSteps = ['#429b81', '#00805d', '#00805d'] // 250% collateral
  // const gradientPercent = Math.round(((vaultCollateral - liquidationCollateral) / (defaultCollateral - liquidationCollateral)) * 100)
  const gradientPercent = Math.round(vaultCollateral / defaultCollateral * 100)
  if (vaultCollateral >= 2.55) {
    gradientSteps = ['#00805E', '#00800D']
  } else if (vaultCollateral <= 2.45 && vaultCollateral > 1.7) {
    gradientSteps = ['#DE6A00', '#DE9000']
  } else if (vaultCollateral <= 1.7) {
    gradientSteps = ['#F0212B', '#F0212B']
  }

  const content = vaultCollateral > 0 ?
    <ProgressBarWrapper gradientSteps={gradientSteps}>
      <ProgressBarText>
        <Percent>{Math.round(vaultCollateral * 100)}%</Percent>
        <Title>collateral</Title>
      </ProgressBarText>
    </ProgressBarWrapper>
    : <NoCollateralWrapper>
      <CollateralValue>No collateral</CollateralValue>
    </NoCollateralWrapper>

  return content
}

export const DetailedCard = observer((props: { isShown: null | boolean, onClick: (e: any) => void }) => {
  const { router } = useRoute()
  const { dataStore, authStore } = useStores()
  const { address } = authStore
  const { westBalance, eastBalance, vaultEastAmount, vault, transferedEastAmount, vaultCollateral } = dataStore
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
      </Block>
    </DetailsBody>
    <CardFooter vaultCollateral={vaultCollateral} isShown={props.isShown} />
  </Container>
})
