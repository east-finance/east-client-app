import React, { useRef } from 'react'
import styled from 'styled-components'
import { CrossIcon } from '../../components/Icons'

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
