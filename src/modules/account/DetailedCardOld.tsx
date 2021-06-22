import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import NoiseImg from '../../resources/images/noise.png'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { Block, Block16 } from '../../components/Block'
import { CollateralCircle } from '../../components/CollateralCircle'
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
  height: 260px;
  box-sizing: border-box;
  // background: rgba(255, 255, 255, 1);
  background: rgb(210 226 227);
  // background-image: url(${NoiseImg});
  background-size: 400%;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 6px;
  
  position: absolute;
  z-index: -10;
  margin-right: -64px;
  margin-top: -64px;

  animation: ${props => animationCondition(props.isShown)}
`

const Content = styled.div`
  box-sizing: border-box;
  // backdrop-filter: blur(51px);
  width: inherit;
  height: inherit;
  border-radius: inherit;
  padding: 24px 24px 16px 24px;
`

const IntegerPart = styled.span`
  color: #3D3D3D;
`
const FracPart = styled.span`
  color: #000000;
  opacity: 0.4;
`

const EastBalanceContainer = styled.div`
  font-family: Staatliches;
  letter-spacing: 3px;
  font-weight: 300;
  font-size: 32px;
  line-height: 28px;
`

const EastBalance = (props: { value: string, style?: any }) => {
  const { value } = props
  const parts = value.toString().split('.')
  const integerPart = parts[0]
  let fractionalPart = parts[1]
  if ((fractionalPart && +fractionalPart.slice(0, 8) === 0) || (!fractionalPart)) {
    fractionalPart = '00'
  }
  return <EastBalanceContainer style={props.style}>
    <IntegerPart>{integerPart}</IntegerPart>
    {fractionalPart &&
      <FracPart>,{fractionalPart.slice(0, 8)}</FracPart>
    }
  </EastBalanceContainer>
}

const Description = styled.div`
  color: #8D8D8D;
  font-size: 15px;
  line-height: 15px;
  font-weight: 300;
`

const FlexColumn = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  height: 100%;
`

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
`

const StickToBottom = styled.div`
  margin-top: auto;
`

const SmallBalance = styled.div`
  > div {
    font-family: Cairo;
    font-size :20px;
    line-height: 16px;
    font-weight: bold;
    letter-spacing: 0px;
  }
`

export const DetailedCard = observer((props: { isShown: null | boolean, onClick: () => void }) => {
  const { router } = useRoute()
  const { dataStore } = useStores()
  const { vault, vaultCollateral, transferedEastAmount } = dataStore
  const onIssueClicked = (e: any) => {
    e.stopPropagation()
    router.navigate(RouteName.AddEast)
  }
  const onSupplyClicked = (e: any) => {
    e.stopPropagation()
    router.navigate(RouteName.SupplyVault)
  }
  return <Container {...props}>
    <Content>
      <FlexRow>
        <FlexColumn>
          <EastBalance value={vault.eastAmount} />
          <Block marginTop={4}>
            <Description>EAST collateralized by vault</Description>
          </Block>
          <Block16>
            <EastBalance value={transferedEastAmount} />
            <Block marginTop={4}>
              <Description>EAST yet not collateralized (transfered)</Description>
            </Block>
          </Block16>
          <StickToBottom>
            <Description>Locked in vault</Description>
            <Block marginTop={8} style={{ display: 'flex' }}>
              <SmallBalance><EastBalance value={vault.westAmount} /></SmallBalance>
              <Description>&nbsp;WEST</Description>
            </Block>
            <Block marginTop={8} style={{ display: 'flex' }}>
              <SmallBalance><EastBalance value={vault.usdpAmount} /></SmallBalance>
              <Description>&nbsp;USDap</Description>
            </Block>
          </StickToBottom>
        </FlexColumn>
        <div>
          <CollateralCircle value={Math.round(vaultCollateral * 100)} text={'Collateral'} />
          <Block16>
            <Button type={'primary'} size={'small'} onClick={onIssueClicked}>Issue EAST</Button>
          </Block16>
          <Block marginTop={12}>
            <Button
              size={'small'}
              style={{ color: '#043569', background: '#b9cdd7' }}
              onClick={onSupplyClicked}
            >Add WEST</Button>
          </Block>
        </div>
      </FlexRow>
    </Content>
  </Container>
})