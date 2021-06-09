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
  [CollateralStatus.overPerformed]: 'rgba(224, 224, 224, 0.5)',
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
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  opacity: 0.6;
`

const SVGPrimary = styled.svg<{ status?: CollateralStatus }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  transform: rotateY(-180deg) rotateZ(-90deg);

  circle {
    stroke-dasharray: 365;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    stroke-width: 3px;
    //stroke: #00A87A;
    stroke: ${props => props.status ? CollateralColor[props.status] : props.theme.black};
    fill: none;
  }
`

const SVGSecondary = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  transform: rotateY(-180deg) rotateZ(-90deg);

  circle {
    //stroke-dasharray: 364;
    //stroke-dashoffset: -280;
    stroke-dasharray: 365;
    stroke-dashoffset: -300;
    stroke-linecap: round;
    stroke-width: 3px;
    //stroke: #00A87A;
    fill: none;
  }
`

interface IProps {
  percent: number;
}

/*
* angle = 360 / 6 = 60

Math.sin(Math.PI*60/180)*120 == 103.9230

Math.cos(Math.PI*60/180)*120 == 60.0000
* */

/* #844d72 #af6179 #96a0bf*/

const getCollateralStatus = (percent: number) => {
  if (percent > 250) {
    return CollateralStatus.overPerformed
  } else if (percent === 250) {
    return CollateralStatus.default
  } else if (percent < 250 && percent > 140) {
    return CollateralStatus.underPerformed
  } else return CollateralStatus.liquidationSoon
}

export const CollateralCircle = (props: IProps) => {
  const { percent } = props
  const absolutePercent = (percent - Percentage.min) / (Percentage.max - Percentage.min)
  const status = getCollateralStatus(percent)
  const fullCircleLength = Math.ceil(2 * Math.PI * 58)
  const primaryDashOffset = - (fullCircleLength - (fullCircleLength * absolutePercent))
  return <Container>
    <TextContainer color={CollateralColor[status]}>
      <PrimaryText>{props.percent}%</PrimaryText>
    </TextContainer>
    {/*<SVGSecondary>*/}
    {/*  <defs>*/}
    {/*    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">*/}
    {/*      <stop offset="0%" stopColor="#844d72" />*/}
    {/*      <stop offset="50%" stopColor="#af6179" />*/}
    {/*      <stop offset="100%" stopColor="#96a0bf" />*/}
    {/*    </linearGradient>*/}
    {/*  </defs>*/}
    {/*  <circle r="58" cx="60" cy="60" stroke="url(#gradient)" />*/}
    {/*</SVGSecondary>*/}
    <SVGPrimary status={status}>
      <circle r="58" cx="60" cy="60" style={{
        strokeDashoffset: primaryDashOffset
      }} />
    </SVGPrimary>
  </Container>
}

const Test = styled.div`
  margin: 25px 0;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 12px solid transparent;
  background-size: 100% 100%, 50% 50%, 50% 50%, 50% 50%, 50% 50%;
  background-repeat: no-repeat;
  background-image: linear-gradient(white, white), 
                    linear-gradient(30deg, red 36%, lightgrey 30%),
                    linear-gradient(120deg, yellow 36%, lightgrey 30%),
                    linear-gradient(300deg, blue 36%, lightgrey 30%),
                    linear-gradient(210deg, green 36%, lightgrey 30%);
  background-position: center center, left top, right top, left bottom, right bottom;
  background-origin: content-box, border-box, border-box, border-box, border-box;
  background-clip: content-box, border-box, border-box, border-box, border-box;
  transform: rotate(30deg);
`

export const CollateralCircle2 = () => {
  return <Test />
}
