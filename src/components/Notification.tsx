import React from 'react'
import styled from 'styled-components'
import iconCross from '../resources/images/icon-cross.svg'

const Container = styled.div<{ type: 'default' | 'error' }>`
  display: flex;
  align-items: center;
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #0A0606;
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 18px);
  height: calc(100% - 2px);
  padding-left: 16px;
  background: ${props => props.type === 'default' ? 'white' : '#FFF0F1'};
  box-shadow: 0 32px 32px rgb(0 0 0 / 15%);
  border-radius: 4px;

  ${({ type }) => (type === 'error') && `
    border: 1px solid rgba(240, 33, 43, 0.4);
    color: #F0222B;
    font-weight: bold;
  `}
`

export interface IProps {
  text: string;
}

export const ErrorNotification = (props: IProps) => {
  return <Container type={'error'}>
    {props.text}
  </Container>
}

export const TextNotification = (props: IProps) => {
  return <Container type={'default'}>
    {props.text}
  </Container>
}

export interface IToastCloseButton {
  closeToast: () => void;
}

const CloseButtonContainer = styled.div`
  width: 32px;
  height: 32px;
  z-index: 1;
  padding-top: 8px;
`

const IconCross = styled.div`
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 32px;
  mask-image: url(${iconCross});
  background-color: red;
`

export const ToastCloseButton = (props: IToastCloseButton) => {
  return <CloseButtonContainer onClick={props.closeToast}>
    <IconCross />
  </CloseButtonContainer>
}
