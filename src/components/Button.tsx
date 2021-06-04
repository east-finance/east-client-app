import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'
import ArrowLeft from '../resources/images/arrow-left.svg'
import ArrowLeftButton from '../resources/images/arrow-left-button.png'


interface ButtonProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  type?: 'default' | 'primary' | 'submit';
  children?: any;
}

const ButtonContainer = styled.div<ButtonProps>`
  height: 55px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F2F2F2;
  color: #000000;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  //transition: all .4s ease-in-out;


  ${({ type }) => type === 'primary' && `
    background: radial-gradient(204.55% 3032.86% at 67.55% 85.45%, rgba(172, 171, 216, 0) 0%, #514EFF 100%),
    linear-gradient(0deg, #1D87D6, #1D87D6);
    color: white;
    background-size: 300% 100%;
    
    :hover {
      background-position: 100% 0;
    }
  `}

  ${({ disabled }) => disabled && `
    background: #dae1e9;
    color: rgba(4, 53, 105, 0.5);
    cursor: default;
    pointer-events: none;
  `}
`

const ButtonSpan = styled.span`
  /* Fallback: Set a background color. */
  background-color: red;

  /* Create the gradient. */
  //background-image: linear-gradient(45deg, #f3ec78, #af4261);
  background: radial-gradient(204.55% 3032.86% at 67.55% 85.45%, rgba(172, 171, 216, 0) 0%, #514EFF 100%),
  linear-gradient(0deg, #1D87D6, #1D87D6);


  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`

export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const content = props.type === 'primary'
    ? <span>{props.children}</span>
    : <ButtonSpan>{props.children}</ButtonSpan>
  return <ButtonContainer {...props}>
    {content}
  </ButtonContainer>
}

const NaviContainer = styled.div`
  width: 64px;
  height: 55px;
  border: 2px solid #FFFFFF;
  box-sizing: border-box;
  border-radius: 4px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`

const NaviLeftContainer = styled(NaviContainer)`
  background-image: url(${ArrowLeft});
`

const NaviLeftContainerGrad = styled.div`
  width: 64px;
  height: 55px;
  background-image: url(${ArrowLeftButton});
  background-size: 100% 100%;
  cursor: pointer;
`

export const NavigationLeft = (props: ButtonProps) => {
  return <NaviLeftContainer {...props} />
}

export const NavigationLeftGradient = (props: ButtonProps) => {
  return <NaviLeftContainerGrad {...props} />
}

export const NavigationLeftGradientButton = (props: ButtonProps) => {
  return <NaviLeftContainerGrad {...props} />
}
