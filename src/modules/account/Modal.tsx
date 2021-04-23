import React, { useRef } from 'react'
import styled from 'styled-components'
import crossImg from '../../resources/images/cross.svg'
import useOutsideAlerter from '../../hooks/useOutsideHandler'

interface ModalProps {
  children: React.ReactChild[] | React.ReactChild;
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

const CrossIcon = styled.div`
  position: absolute;
  top: 16px;
  right:16px;
  width: 48px;
  height: 48px;
  background-image: url(${crossImg});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
`

export const PrimaryModal = (props: ModalProps) => {
  const wrapperRef = useRef(null)
  const onClickOutside = () => {
    props.onClose()
  }
  useOutsideAlerter(wrapperRef, onClickOutside)
  return <Container ref={wrapperRef}>
    <CrossIcon onClick={props.onClose} />
    {props.children}
  </Container>
}
