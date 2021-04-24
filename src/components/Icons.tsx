import styled from 'styled-components'
import crossImg from '../resources/images/cross.svg'

export const CrossIcon = styled.div<{ color?: string }>`
  width: 48px;
  height: 48px;
  mask-image: url(${crossImg});
  background-color: ${props => props.color ? props.color : '#D1D1D1'};
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
`
