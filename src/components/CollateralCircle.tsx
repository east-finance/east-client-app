import React from 'react'
import styled from 'styled-components'
import { Block } from './Block'

enum CollateralStatus {
  overPerformed = 'overPerformed',
  default = 'default',
  underPerformed = 'underPerformed',
  liquidationSoon = 'liquidationSoon'
}

const CollateralColor = {
  [CollateralStatus.overPerformed]: 'rgb(151 82 112)',
  [CollateralStatus.default]: '#00A87A',
  [CollateralStatus.underPerformed]: '#F8B700',
  [CollateralStatus.liquidationSoon]: '#F0222B'
}

const Percentage = {
  min: 130,
  max: 250
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 120px;
  width: 120px;
  text-align: center;
`

const TextContainer = styled.div<{ color: string }>`
  color: ${props => props.color};
`

const PrimaryText = styled.div`
  font-family: Staatliches,sans-serif;
  font-size: 32px;
  line-height: 32px;
  letter-spacing: 3px;
`

const SecondaryText = styled.div`
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  opacity: 0.6;
`

const getCollateralStatus = (value: number) => {
  if (value > 255) {
    return CollateralStatus.overPerformed
  } else if (value <= 255 && value >= 245) {
    return CollateralStatus.default
  } else if (value < 245 && value >= 170) {
    return CollateralStatus.underPerformed
  } else return CollateralStatus.liquidationSoon
}

const SVGWrapper = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  width: inherit;
  height: inherit;
  transform: rotate(-90deg);
`

const SVGCircle = styled.circle`
  fill: rgba(0,0,0,0);
  stroke: #fff;
  stroke-dashoffset: 239.91148575129;
  stroke-width: 2;
`

const CircleIncomplete = styled(SVGCircle)`
  stroke: white;
`

const CircleComplete = styled(SVGCircle)`
  stroke-dasharray: 239.91148575129;
  // stroke: #00A87A;
`

export interface ICircleProps {
  value: number;
  text?: string;
}

export const CollateralCircle = (props: ICircleProps) => {
  const { value } = props
  const status = getCollateralStatus(value)
  const primaryColor = CollateralColor[status]
  const secondaryColor = status === CollateralStatus.overPerformed ? 'rgb(209 209 209)' : 'white'

  let valueModule = value
  if (status === CollateralStatus.default) {
    valueModule = Percentage.max
  } else if (status === CollateralStatus.overPerformed) {
    valueModule = Percentage.min + (value % Percentage.max)
    if (value >= 370) {
      valueModule = 250
    }
  }
  const radius = 38
  const fullCircleLength = Math.ceil(2 * Math.PI * radius)
  const absolutePercent = (valueModule - Percentage.min) / (Percentage.max - Percentage.min)
  const primaryDashOffset = (fullCircleLength - (fullCircleLength * absolutePercent))

  return <Container>
    <TextContainer color={primaryColor}>
      <PrimaryText>{props.value}%</PrimaryText>
      {props.text &&
        <Block marginTop={4}>
          <SecondaryText>{props.text}</SecondaryText>
        </Block>
      }
    </TextContainer>
    <SVGWrapper viewBox="0 0 80 80">
      <CircleIncomplete cx="40" cy="40" r="38" style={{ stroke: secondaryColor }} />
      <CircleComplete cx="40" cy="40" r="38" style={{ strokeDashoffset: primaryDashOffset, stroke: primaryColor }} />
    </SVGWrapper>
  </Container>
}
