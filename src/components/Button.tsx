import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'
import ArrowLeft from '../resources/images/arrow-left.svg'
import ArrowLeftButton from '../resources/images/arrow-left-button.png'


interface ButtonProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  type?: 'default' | 'primary' | 'submit';
  size?: 'default' | 'small';
  children?: any;
  style?: any;
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
  
  ${({ size }) => size === 'small' && `
    height: 38px;
    border-radius: 42px;
  `}

  ${({ type }) => type === 'primary' && `
    background-image: linear-gradient(to right, #545ff5 0%, #3b8ad9 51%, #4687dc 100%);
    background-size: 200% auto;
    transition: background-position 0.5s;
    color: white;
    
    :hover {
      background-position: right center;
    }
  `}

  ${({ disabled }) => disabled && `
    background: #dae1e9;
    color: #6f8ba8;
    cursor: default;
    pointer-events: none;
  `}
`

const GradientText = styled.span`
  background: radial-gradient(204.55% 3032.86% at 67.55% 85.45%, rgba(172, 171, 216, 0) 0%, #514EFF 100%),
  linear-gradient(0deg, #1D87D6, #1D87D6);
  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`

export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const content = (props.type === 'primary' || props.size === 'small')
    ? <span>{props.children}</span>
    : <GradientText>{props.children}</GradientText>
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

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  
  > div:not(:first-child) {
    margin-left: 8px;
  }
`
