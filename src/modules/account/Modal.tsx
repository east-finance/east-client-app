import React from 'react'
import styled from 'styled-components'
import { CrossIcon } from '../../components/Icons'
import gradientBackground from '../../resources/images/gradient-bg2.png'

export enum ModalStatus {
  success = 'success',
  warning = 'warning'
}

interface ModalProps {
  status?: ModalStatus;
  children: JSX.Element | JSX.Element[];
  onClose?: () => void;
  style?: any;
}

const Container = styled.div<{ status?: ModalStatus }>`
  background-color: rgba(255, 255, 255, 0.8);
  background-image: linear-gradient(0deg, rgba(248, 249, 250, 0) 85%, ${props => props.status === ModalStatus.warning ? props.theme.yellow : props.theme.greenToxic} 100%);
  box-shadow: 0 4px 72px rgba(0, 0, 0, 0.15);
  border-radius: 41px;
  padding: 16px 60px 32px;
  
  @media only screen and (min-width : 480px) and (max-width : 812px) {
    padding: 16px;
  }
`

const IconContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  transition: transform 250ms;
  
  :hover {
    transform: scale(1.1);
  }
`

export const PrimaryModal = (props: ModalProps) => {
  return <Container status={props.status} style={{...props.style}}>
    {props.onClose &&
      <IconContainer>
        <CrossIcon color={'rgba(4, 53, 105, 0.5);'} onClick={props.onClose} />
      </IconContainer>
    }
    {props.children}
  </Container>
}

export const SecondaryModal = styled.div`
  position: absolute;
  top: 0;
  width: 208px;
  padding: 16px;
  box-sizing: border-box;
  left: calc(-208px - 16px);
  height: 100%;
  border-radius: 22px;
  background-image: url(${gradientBackground});
  background-repeat: no-repeat;
  background-size: 120% 100%;
  filter: drop-shadow(0px 4px 72px rgba(0, 0, 0, 0.15));
`

export const SecondaryModalButton = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(224, 224, 224, 0.25);
  border-radius: 8px;
  text-align: center;
  color: #FFFFFF;
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
`
