import React, { useEffect, useState } from 'react'
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

const collateralFill = (from: number, to: number) => keyframes`
  from { right: ${from}%; }
  to { right: ${to}%; }
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
  cursor:  pointer;

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

const ProgressBarWrapper  = styled.div<{ prevPercent: number, percent: number, gradientSteps: string[], isShown: IsShown }>`
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
    animation: ${props => collateralFill(Math.ceil(100 - props.prevPercent), Math.ceil(100 - props.percent))} 800ms ease forwards;
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

enum CollateralLevelName {
  high = 'high',
  normal = 'normal',
  low = 'low'
}

const getCollateralLevelName = (vaultCollateral: number) => {
  if (vaultCollateral > 2.45) {
    return CollateralLevelName.high
  } else if (vaultCollateral <= 2.45 && vaultCollateral > 1.7) {
    return CollateralLevelName.normal
  } else {
    return CollateralLevelName.low
  }
}

const CardFooter = (props: { vaultCollateral: number, isShown: null | boolean }) => {
  const { configStore } = useStores()
  const defaultCollateral = configStore.getWestCollateral()
  // const  liquidationCollateral = configStore.getLiquidationCollateral()

  const [prevCollateral, setPrevCollateral] = useState(0)
  const [vaultCollateral, setCollateral] = useState(props.vaultCollateral)

  useEffect(() => {
    if (props.vaultCollateral !== vaultCollateral) {
      setPrevCollateral(vaultCollateral)
      setCollateral(props.vaultCollateral)
    }
  }, [props.vaultCollateral])

  const levelName = getCollateralLevelName(vaultCollateral)
  let gradientSteps = ['#00800D', '#00805E'] // 250% default collateral
  // const gradientPercent = Math.round(((vaultCollateral - liquidationCollateral) / (defaultCollateral - liquidationCollateral)) * 100)
  const prevPercent = prevCollateral > 0
    ? Math.min(Math.round(prevCollateral / defaultCollateral * 100), 100)
    : 0
  const currentPercent = Math.min(Math.round(vaultCollateral / defaultCollateral * 100), 100)
  if (levelName === CollateralLevelName.high) {
    gradientSteps = ['#00800D', '#00805E']
  } else if (levelName === CollateralLevelName.normal) {
    gradientSteps = ['#DE6A00', '#DE9000']
  } else if (levelName === CollateralLevelName.low) {
    gradientSteps = ['#F0212B', '#F0212B']
  }

  const title = vaultCollateral > 0
    ? <Title isShown={props.isShown}>collateral</Title>
    : <StaticTitle>no collateral</StaticTitle>

  return <ProgressBarWrapper
    isShown={props.isShown}
    prevPercent={prevPercent}
    percent={currentPercent}
    gradientSteps={gradientSteps}
  >
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
  const { westBalance, vaultCollateral, vaultEastProfit, vault } = dataStore
  const { eastAmount: freeEastAmount } = vaultEastProfit
  const isVaultLiquidated = +vault.eastAmount > 0 && +vault.westAmount === 0

  const levelName = getCollateralLevelName(vaultCollateral)

  const getAddWestButtonStyles = () => {
    let color = '#000000'
    let background = 'rgba(4, 53, 105, 0.15)' // High collateral
    if (levelName === CollateralLevelName.normal) {
      background = 'linear-gradient(90deg, #DE6A00 0%, #DE9000 100%)'
      color = '#FFFFFF'
    } else if (levelName === CollateralLevelName.low) {
      background = '#F0212B'
      color = '#FFFFFF'
    }
    return {
      color,
      background
    }
  }

  const getAddEastButtonStyles = () => {
    let color = '#FFFFFF'
    let background = 'linear-gradient(90deg, #5352B8 0%, #323177 100%)' // High or low collateral
    if (levelName === CollateralLevelName.normal) {
      background = 'rgba(0, 0, 0, 0.1)'
      color = '#000000'
    }
    return {
      color,
      background
    }
  }

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
        {!isVaultLiquidated &&
          <SmallButtonContainer>
            <Button
              size={'small'}
              style={getAddWestButtonStyles()}
              onClick={(e: any) => {
                e.stopPropagation()
                router.navigate(RouteName.SupplyVault)
              }
              }
            >
              Add WEST
            </Button>
          </SmallButtonContainer>
        }
        <SmallButtonContainer>
          <Button
            size={'small'}
            style={getAddEastButtonStyles()}
            onClick={(e: any) => {
              e.stopPropagation()
              if (isVaultLiquidated) {
                router.navigate(RouteName.BuyEast)
              } else {
                router.navigate(RouteName.AddEast)
              }
            }}
          >
            Issue EAST
          </Button>
        </SmallButtonContainer>
        {freeEastAmount >= 0.1 &&
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
