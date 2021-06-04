import styled, { keyframes } from 'styled-components'


const SpinnerBorder = keyframes`
  100% {
    transform: rotate(
            360deg
    );
  }
`

export interface ISpinnerProps {
  color?: string;
}

export const Spinner = styled.div<ISpinnerProps>`
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
  border: 2px solid;
  border-color: ${props => props.color ? props.color : 'white'};
  border-right-color: transparent;
  border-radius: 60%;
  -webkit-animation: spinner-border .75s linear infinite;
  animation: ${SpinnerBorder} .75s linear infinite;  
`

export const RelativeContainer = styled.div`
  position: relative;
`

export const BeforeText = styled.div`
  position: absolute;
  margin-left: -32px;
  display: flex;
  align-items: center;
  height: 100%;
`


