import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'


interface ButtonProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  type?: 'default' | 'primary';
  children: any;
}

const ButtonContainer = styled.div<ButtonProps>`
  height: 55px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #C4C4C4;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;

  background: ${props => props.type === 'primary' ? 'black' : '#C4C4C4'};
  color: ${props => props.type === 'primary' ? 'white' : '#000000'};
`

export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return <ButtonContainer {...props}>
    { props.children }
  </ButtonContainer>
}
