import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import CardBackground from '../../resources/images/card-dark-back.jpeg'
import NoiseImg from '../../resources/images/noise.png'
import iconPlus from '../../resources/images/plus.png'
import eastLogoSmall from '../../resources/images/east-logo-small.png'
import { Block, Block24 } from '../../components/Block'
import { observer } from 'mobx-react'
import useStores from '../../hooks/useStores'
import { spacifyFractional } from '../../utils'
import { RouteName } from '../../router/segments'
import { useRoute } from 'react-router5'
import { Icon } from '../../components/Icons'

const FadeInFront = keyframes`
  from{transform: scale(0.8); opacity: 0;}
  to{transform: scale(1); opacity: 1;}
`

const FrontToFrontAgain = keyframes`
  from {transform: translate(0,0) scale(0.9,0.9);z-index:-1}
  51% {z-index:-1;}
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
    return css`${FadeInFront} 650ms ease forwards`
  }
}

const Container = styled.div<{ isShown: null | boolean }>`
  // z-index: 10;
  cursor:  pointer;
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

const IntegerPart = styled.span<{ type: BalanceType }>`
  font-size: ${props => props.type === BalanceType.large ? '64px' : '18px' };
  line-height: ${props => props.type === BalanceType.large ? '48px' : '16px' };
  color: #F8F8F8;
  letter-spacing: ${props => props.type === BalanceType.large ? '3px' : '2px' };
  font-weight: 300;
`

const FracPart = styled.span<{ type: BalanceType }>`
  font-size: ${props => props.type === BalanceType.large ? '32px' : '18px' };
  line-height: ${props => props.type === BalanceType.large ? '28px' : '16px' };
  color: #F8F8F8;
  letter-spacing: ${props => props.type === BalanceType.large ? '3px' : '2px' };
  font-weight: 300;
  opacity:  0.6;
`

enum BalanceType {
  large = 'large',
  small = 'small'
}

interface ITokenBalanceProps {
  id?: string;
  value: string;
  type?: BalanceType;
}

const TokenBalance = (props: ITokenBalanceProps) => {
  const { value } = props
  let integerPart = value
  let fractionalPart = ''
  const match = value.toString().match(/[.,]/)
  if (match && match[0]) {
    const separator = match[0]
    // eslint-disable-next-line prefer-const
    let parts = value.toString().split(separator)
    integerPart = parts[0]
    fractionalPart = parts[1]
    if (fractionalPart) {
      fractionalPart = spacifyFractional(fractionalPart)
    }
  }
  return <div id={props.id || ''} data-value={value}>
    <IntegerPart type={props.type || BalanceType.small}>{integerPart}</IntegerPart>
    {fractionalPart &&
      <FracPart type={props.type || BalanceType.small}>,{fractionalPart}</FracPart>
    }
  </div>
}

export const AccountCard = observer((props: { isShown: null | boolean, onClick: (e: any) => void }) => {
  const { router } = useRoute()
  const { dataStore } = useStores()

  const { eastBalance, vault } = dataStore
  const isPositiveBalance = +eastBalance > 0 || +vault.eastAmount > 0

  return <Container {...props} data-attr={'cardFront'}>
    <EastLogoSmall backgroundImage={eastLogoSmall} size={50} />
    {!isPositiveBalance &&
      <PlusContainer>
        <PlusImage onClick={() => router.navigate(RouteName.Mint)}/>
        <Block24>
          <AddEast onClick={() => router.navigate(RouteName.Mint)}>Issue East</AddEast>
        </Block24>
      </PlusContainer>
    }
    <ContentWrapper>
      {isPositiveBalance &&
        <TopContainer>
          <TokenBalance type={BalanceType.large} value={eastBalance} id={'east-balance'} />
          <Block marginTop={12}>
            <Description>EAST available</Description>
          </Block>
        </TopContainer>
      }
      {isPositiveBalance &&
        <BottomContainer>
          {+vault.eastAmount > 0 &&
            <div>
              <div>
                <TokenBalance type={BalanceType.small} value={vault.eastAmount} id={'east-vault-amount'} />
                <Block marginTop={4}>
                  <BottomItem>EAST issued with vault</BottomItem>
                </Block>
              </div>
              <FlexColumnWrapper style={{ marginTop: '16px' }}>
                <div>
                  <TokenBalance type={BalanceType.small} value={vault.westAmount} id={'west-vault-amount'} />
                  <Block marginTop={4}>
                    <BottomItem>west in vault</BottomItem>
                  </Block>
                </div>
                {+vault.rwaAmount > 0 &&
                  <div>
                    <TokenBalance type={BalanceType.small} value={vault.rwaAmount} />
                    <Block marginTop={4}>
                      <BottomItem>usdap in vault</BottomItem>
                    </Block>
                  </div>
                }
              </FlexColumnWrapper>
            </div>
          }
          {+vault.eastAmount === 0 &&
            <BottomItem>no issued east yet</BottomItem>
          }
        </BottomContainer>
      }
    </ContentWrapper>
  </Container>
})
