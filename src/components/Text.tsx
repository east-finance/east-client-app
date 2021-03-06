import styled from 'styled-components'

export const BrutalTitle = styled.div`
  font-family: BrutalType,sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 48px;
  letter-spacing: -1px;
  text-transform: uppercase;
  color: #0A0606;
`

export const GradientText = styled.span`
  background: linear-gradient(90deg, #514EFF 0%, #1D87D6 35%, #1D87D6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @supports (-webkit-touch-callout: none) {
    color: #1D87D6;
    background: unset;
    background-clip: unset;
    -webkit-text-fill-color: unset;
  }
`
