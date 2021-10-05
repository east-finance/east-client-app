import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { isMobile } from 'react-device-detect'
import { PrimaryTitle } from '../../../components/PrimaryTitle'
import { PrimaryModal, SecondaryModal, SecondaryModalButton } from '../Modal'
import { Block, Block16 } from '../../../components/Block'
import { InputStatus, SimpleInput } from '../../../components/Input'
import { CrossIcon } from '../../../components/Icons'
import useStores from '../../../hooks/useStores'
import { GradientText } from '../../../components/Text'
import { SignStrategy } from '../../../stores/SignStore'
import { useRoute } from 'react-router5'
import { RouteName } from '../../../router/segments'

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
  @media screen and (min-width: 900px) {
    width: 376px;
  }
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

const Option = styled(GradientText)`
  display: block;
  margin-top: 24px;
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
`

const ValidationErrorWrapper = styled.div`
  height: 16px;
  font-family: Cairo,sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: ${props => props.theme.red};
`

interface IPassChangeProps {
  visible: boolean;
  onClose: () => void;
}

const PasswordChange = (props: IPassChangeProps) => {
  const { api, authStore } = useStores()

  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordError, setOldPasswordError] = useState('')

  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [confirm, setConfirm] = useState('')

  const onChangeClicked = async () => {
    let errorOldPass = '', errorPass = ''
    if (!oldPassword) {
      errorOldPass = 'Enter old password'
    } else {
      if (!password) {
        errorPass = 'Enter new password'
      } else {
        if (password !== confirm) {
          errorPass = 'Passwords do not match'
        }
      }
    }
    if (!errorOldPass && !errorPass) {
      let oldPasswordCorrect = false
      try {
        await api.signIn(authStore.email, oldPassword)
        oldPasswordCorrect = true
      } catch (e) {
        if(e.message.includes('401')) {
          errorOldPass = 'Wrong old password'
        } else {
          errorOldPass = 'Unknown error. Try again later'
        }
      }
      if (oldPasswordCorrect) {
        try {
          await api.changePassword(password)
          toast('Password changed!')
        } catch (e) {
          errorPass = 'Unknown error. Try again later'
        }
      }
    }
    setOldPasswordError(errorOldPass)
    setPasswordError(errorPass)
  }

  const validationError = oldPasswordError || passwordError

  let mobileStyles = {}
  if (isMobile) {
    mobileStyles = {
      width: '100%',
      left: 0,
      display: props.visible ? 'block' : 'none',
    }
  }


  return <SecondaryModal style={{
    visibility: props.visible ? 'visible' : 'hidden',
    ...mobileStyles
  }}>
    <FlexWrapper>
      <IconContainer onClick={props.onClose}>
        <CrossIcon color={'white'} />
      </IconContainer>
      <Block marginTop={100}>
        <PasswordChangeForm>
          <H3>Password change</H3>
          <Block marginTop={40} />
          <SimpleInput
            type={'password'}
            label={'Old password'}
            autoComplete='new-password'
            status={oldPasswordError ? InputStatus.error : InputStatus.default}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
          />
          <SimpleInput
            type={'password'}
            label={'New password'}
            autoComplete='new-password'
            status={passwordError ? InputStatus.error : InputStatus.default}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <SimpleInput
            type={'password'}
            label={'Confirm new password'}
            autoComplete='new-password'
            status={passwordError ? InputStatus.error : InputStatus.default}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
          />
        </PasswordChangeForm>
      </Block>
      <ValidationErrorWrapper>
        {validationError}
      </ValidationErrorWrapper>
      <div style={{ marginTop: 'auto' }}>
        <SecondaryModalButton onClick={onChangeClicked}>
          Change
        </SecondaryModalButton>
      </div>
    </FlexWrapper>
  </SecondaryModal>
}

export const Settings = (props: IProps) => {
  const { router } = useRoute()
  const { authStore, dataStore, signStore } = useStores()

  const [passChangeVisible, setPassChangeVisible] = useState(false)

  const onPassChangeClicked = () => setPassChangeVisible(!passChangeVisible)

  const onLogoutClicked = () => {
    dataStore.logout()
    authStore.logout()
  }

  const onChangeSeedClicked = () => {
    dataStore.logout()
    authStore.logout()
    router.navigate(RouteName.SignInSelectType)
  }

  return <PrimaryModal {...props} id={'settings-modal'}>
    <PrimaryTitle>Settings</PrimaryTitle>
    <div>
      <Container>
        <Block marginTop={55}>
          <SimpleInput disabled label={'Email'} value={authStore.email} />
        </Block>
        <Block16>
          <SimpleInput disabled label={'Blockchain address'} value={authStore.address} />
        </Block16>
        <Block marginTop={52}>
          <OptionsContainer>
            <Option onClick={onPassChangeClicked}>Change password</Option>
            {/* <Option>View SEED phrase</Option> */}
            {signStore.signStrategy === SignStrategy.Seed &&
              <Option onClick={onChangeSeedClicked}>Change SEED</Option>
            }
            <Option onClick={onLogoutClicked}>Logout</Option>
          </OptionsContainer>
        </Block>
      </Container>
      <PasswordChange visible={passChangeVisible} onClose={() => setPassChangeVisible(false)} />
    </div>
  </PrimaryModal>
}
