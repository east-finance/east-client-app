import React, { useRef } from 'react'
import styled from 'styled-components'
import useOutsideAlerter from '../../hooks/useOutsideHandler'
import { CrossIcon } from '../../components/Icons'

interface ModalProps {
  children: JSX.Element | JSX.Element[];
  onClose: () => void;
}

const Container = styled.div`
  display: block;
  position: fixed;
  z-index: 9999;
  width: 625px;
  background: #FFFFFF;
  box-shadow: 0 4px 72px rgba(0, 0, 0, 0.15);
  border-radius: 22px;
  padding: 32px 60px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const IconContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`

export const PrimaryModal = (props: ModalProps) => {
  const wrapperRef = useRef(null)
  const onClickOutside = () => {
    props.onClose()
  }
  useOutsideAlerter(wrapperRef, onClickOutside)
  return <Container ref={wrapperRef}>
    <IconContainer>
      <CrossIcon color={'#D1D1D1'} onClick={props.onClose} />
    </IconContainer>
    {props.children}
  </Container>
}
