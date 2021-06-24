import React from 'react'
import styled from 'styled-components'
import iconCross from '../resources/images/icon-cross.svg'

export enum NotificationType {
  default = 'default',
  error = 'error'
}

export interface IToastCloseButton {
  type: NotificationType;
  closeToast: () => void;
}

const CloseButtonContainer = styled.div`
  width: 32px;
  height: 32px;
  z-index: 1;
  padding-top: 8px;
`

const IconCross = styled.div<{ type: NotificationType }>`
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 32px;
  mask-image: url(${iconCross});
  background-color: black;

  ${({ type }) => (type === NotificationType.error) && `
     background-color: red;
  `}
`

export const ToastCloseButton = (props: IToastCloseButton) => {
  return <CloseButtonContainer onClick={props.closeToast}>
    <IconCross type={props.type} />
  </CloseButtonContainer>
}

const Container = styled.div<{ type: NotificationType }>`
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

  ${({ type }) => (type === NotificationType.error) && `
    border: 1px solid rgba(240, 33, 43, 0.4);
    color: #F0222B;
  `}
`

const MessageTitle = styled.div`
  font-weight: 600;
`
const MessageSubTitle = styled.div`
  font-weight: 300;
  opacity: 0.8;
`

export interface IProps {
  title?: string;
  message?: string;
  children?: JSX.Element | JSX.Element[] | string;
}

export const ErrorNotification = (props: IProps) => <Container type={NotificationType.error}>
  {props.children &&
    <div>{props.children}</div>
  }
  {props.title &&
    <div>
      <MessageTitle>{props.title}</MessageTitle>
      {props.message &&
        <MessageSubTitle>{props.message}</MessageSubTitle>
      }
    </div>
  }
</Container>

export const InfoNotification = (props: IProps) => <Container type={NotificationType.default}>
  <div>{props.children || props.title}</div>
</Container>
