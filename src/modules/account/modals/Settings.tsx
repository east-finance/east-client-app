import React from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal } from '../Modal'
import { Block } from '../../../components/Block'
import { SimpleInput } from '../../../components/Input'

interface IProps {
  onClose: () => void
}

const Container = styled.div`
  width: 376px;
  padding-left: 96px;
`

export const Settings = (props: IProps) => {
  return <PrimaryModal {...props}>
    <Container>
      <PrimaryTitle>Settings</PrimaryTitle>
      <Block marginTop={36} />
      <SimpleInput disabled title={'Email'} defaultValue={'mail@mail.ru'} />
    </Container>
  </PrimaryModal>
}
