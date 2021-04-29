import React, { useRef } from 'react'
import styled from 'styled-components'
import { CrossIcon } from '../../components/Icons'
import gradientBackground from '../../resources/images/gradient-bg2.png'

interface ModalProps {
  children: JSX.Element | JSX.Element[];
  onClose?: () => void;
}

const Container = styled.div`
  background: #FFFFFF;
  box-shadow: 0 4px 72px rgba(0, 0, 0, 0.15);
  border-radius: 22px;
  padding: 32px 60px;
`

const IconContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`

export const PrimaryModal = (props: ModalProps) => {
  return <Container>
    {props.onClose &&
      <IconContainer>
        <CrossIcon color={'#D1D1D1'} onClick={props.onClose} />
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
