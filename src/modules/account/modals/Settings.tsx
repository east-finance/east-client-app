import React, { useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal, SecondaryModal, SecondaryModalButton } from '../Modal'
import { Block, Block16, Block32 } from '../../../components/Block'
import { SimpleInput } from '../../../components/Input'
import { CrossIcon } from '../../../components/Icons'
import useStores from '../../../hooks/useStores'

interface IProps {
  onClose: () => void
}

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: inherit;
`

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
`

const IconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const PasswordChangeForm = styled.div`
  input {
    color: #FFFFFF;
    ::placeholder {
      color: #FFFFFF;
      opacity: 1; /* Firefox */
    }
  }
`

const H3 = styled.div`
  font-family: Cairo,sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 16px;
  color: #FFFFFF;
`

const OptionsContainer = styled.div`
  > div:not(:first-child) {
    margin-top: 20px;
  }
  
  margin-bottom: 60px;
`

const Option = styled.div`
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  background: radial-gradient(rgba(29,135,214,1) 0%, rgba(81,78,255,1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
`

interface IPassChangeProps {
  visible: boolean;
  onClose: () => void;
}

const PasswordChange = (props: IPassChangeProps) => {
  return <SecondaryModal style={{ visibility: props.visible ? 'visible' : 'hidden' }}>
    <FlexWrapper>
      <IconContainer onClick={props.onClose}>
        <CrossIcon color={'white'} />
      </IconContainer>
      <Block marginTop={100}>
        <PasswordChangeForm>
          <H3>Password change</H3>
          <Block marginTop={40} />
          <SimpleInput type={'password'} label={'Old password'} autoComplete='new-password' />
          <SimpleInput type={'password'} label={'New password'} autoComplete='new-password' />
          <SimpleInput type={'password'} label={'Confirm new password'} autoComplete='new-password' />
        </PasswordChangeForm>
      </Block>
      <div style={{ marginTop: 'auto' }}>
        <SecondaryModalButton>Change</SecondaryModalButton>
      </div>
    </FlexWrapper>
  </SecondaryModal>
}

export const Settings = (props: IProps) => {
  const { authStore } = useStores()

  const [passChangeVisible, setPassChangeVisible] = useState(false)

  const onPassChangeClicked = () => setPassChangeVisible(!passChangeVisible)

  return <PrimaryModal {...props}>
    <PrimaryTitle>Settings</PrimaryTitle>
    <div>
      <PasswordChange visible={passChangeVisible} onClose={() => setPassChangeVisible(false)} />
      <Container>
        <Block marginTop={55} />
        <SimpleInput disabled label={'Email'} value={authStore.email} />
        <Block16 />
        <SimpleInput disabled label={'Blockchain address'} value={authStore.address} />
        <Block16 />
        <OptionsContainer>
          <Option onClick={onPassChangeClicked}>Change password</Option>
          <Option>View SEED phrase</Option>
          <Option onClick={() => authStore.logout()}>Logout</Option>
        </OptionsContainer>
      </Container>
    </div>
  </PrimaryModal>
}
