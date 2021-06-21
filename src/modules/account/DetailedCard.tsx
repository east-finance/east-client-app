import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import NoiseImg from '../../resources/images/noise.png'
import { roundNumber } from '../../utils'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { Block } from '../../components/Block'
import { Button } from '../../components/Button'
import { useRoute } from 'react-router5'
import { RouteName } from '../../router/segments'

const aniTime = '1000ms'
const bezier = 'ease'

const BackToFront = keyframes`
  from {transform: translate(0,0);}
  30% {transform: translate(260px,0) rotate(15deg);}
  to {transform: translate(0,0);z-index:10;}
`

const BackToBackAgain = keyframes`
  from {transform: translate(0,0);z-index:10;}
  30% {transform: translate(260px,0) rotate(15deg);}
  32% {z-index:-1;}
  to {transform: translate(0,0);}
`

const FadeIn = keyframes`
  from {
     margin-right: 0px;
     margin-top: 0px;
     z-index: -10;
  }
  to {
    margin-right: -64px;
    margin-top: -64px;
    z-index: -10;
  }
`

const animationCondition = (isShown: null | boolean) => {
  if (isShown === true) {
    return css`${BackToFront} ${aniTime} ${bezier} forwards`
  } else if(isShown === false) {
    return css`${BackToBackAgain} ${aniTime} ${bezier} forwards`
  } else {
    // return 'none'
    return css`${FadeIn} ${aniTime} ${bezier} forwards`
  }
}

const Container = styled.div<{ isShown: null | boolean }>`
  width: 444px;
  height: 270px;
  box-sizing: border-box;
  
  position: absolute;
  z-index: -10;
  margin-right: -64px;
  margin-top: -64px;

  animation: ${props => animationCondition(props.isShown)}
`

const DetailsBody = styled.div`
  height: 220px;
  padding: 24px 16px;
  box-sizing: border-box;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 1);
  box-shadow: 0px 24px 40px rgba(0, 0, 0, 0.4);
`

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const FlexItem = styled.div`
  width: 50%;
`

const Content = styled.div`
  box-sizing: border-box;
  // backdrop-filter: blur(51px);
  width: inherit;
  height: inherit;
  border-radius: inherit;
  padding: 24px 24px 16px 24px;
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

const EastBalance = (props: IEastBalanceProps) => {
  const { type, value, postfix } = props
  const [integerPart, fractionalPart] = value.toString().split('.')
  return <EastBalanceContainer style={props.style}>
    <IntegerPart type={type}>{integerPart}</IntegerPart>
    {fractionalPart &&
      <FracPart type={type}>
        .{fractionalPart}
        {postfix && ` ${postfix}`}
      </FracPart>
    }
  </EastBalanceContainer>
}

const Description = styled.div`
  color: ${props => props.theme.darkBlue50};
  font-size: 11px;
  font-weight: 300;
`

const DetailsFooter = styled.div<{ gradientSteps: string[]; percent: number; }>`
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 48px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 16px;
  background: rgb(222,144,0);
  background: linear-gradient(90deg, ${props => props.gradientSteps[0]} 0%, ${props => props.gradientSteps[1]} ${props => props.percent / 2}%, ${props => props.gradientSteps[2]} ${props => props.percent}%);
`

const CollateralValue = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 34px;
  color: #FFFFFF;
`

const CardFooter = (props: { vaultCollateral: number }) => {
  const { configStore } = useStores()
  const { router } = useRoute()
  const defaultCollateral = configStore.getWestCollateral()
  const  liquidationCollateral = configStore.getLiquidationCollateral()
  const { vaultCollateral } = props

  let gradientSteps = ['#429b81', '#00805d', '#00805d'] // 250% collateral
  const gradientPercent = Math.round(((vaultCollateral - liquidationCollateral) / (defaultCollateral - liquidationCollateral)) * 100)
  if (vaultCollateral >= 2.55) {
    gradientSteps = ['#676797', '#4a4b9e', '#c0c0ba']
  } else if (vaultCollateral <= 2.45 && vaultCollateral > 1.7) {
    gradientSteps = ['#d78b01', '#d78b01', '#c0c0ba']
  } else if (vaultCollateral <= 1.7) {
    gradientSteps = ['#f1212b', '#f1212b', '#c0c0ba']
  }

  return <DetailsFooter gradientSteps={gradientSteps} percent={gradientPercent}>
    <CollateralValue>{Math.round(vaultCollateral * 100)}% collateral</CollateralValue>
    <div style={{ width: '120px' }}>
      <Button
        size={'small'}
        style={{ color: '#FFFFFF', background: 'rgba(4, 53, 105, 0.15)' }}
        onClick={() => router.navigate(RouteName.SupplyVault)}
      >
      Add WEST
      </Button>
    </div>
  </DetailsFooter>
}

export const DetailedCard = observer((props: { isShown: null | boolean, onClick: () => void }) => {
  const { dataStore } = useStores()
  const { eastBalance, vaultEastAmount, vault, transferedEastAmount, vaultCollateral } = dataStore
  return <Container {...props}>
    <DetailsBody>
      <Block marginTop={12}>
        <EastBalance type={EastBalanceType.default} value={eastBalance} postfix={'EAST'} />
      </Block>
      <Block marginTop={24}>
        <FlexContainer>
          <FlexItem>
            <EastBalance type={EastBalanceType.small} value={vaultEastAmount} />
            <Block marginTop={4}>
              <Description>Collateralized</Description>
            </Block>
          </FlexItem>
          <FlexItem>
            <EastBalance type={EastBalanceType.small} value={transferedEastAmount} />
            <Block marginTop={4}>
              <Description>Transfered (not collateralized)</Description>
            </Block>
          </FlexItem>
        </FlexContainer>
      </Block>
      <Block marginTop={16}>
        <Description>In Vault</Description>
        <Block marginTop={8}>
          <FlexContainer>
            <FlexItem>
              <EastBalance type={EastBalanceType.small} value={vault.westAmount} />
              <Block marginTop={4}>
                <Description>WEST</Description>
              </Block>
            </FlexItem>
            <FlexItem>
              <EastBalance type={EastBalanceType.small} value={vault.usdpAmount} />
              <Block marginTop={4}>
                <Description>USDap</Description>
              </Block>
            </FlexItem>
          </FlexContainer>
        </Block>
      </Block>
    </DetailsBody>
    <CardFooter vaultCollateral={vaultCollateral} />
  </Container>
})
