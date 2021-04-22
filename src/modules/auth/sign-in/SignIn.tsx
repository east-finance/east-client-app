import React, { useState } from 'react'
import { Link, useRoute } from 'react-router5'
import { Block, Block16, Block24, Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input, InputExplain } from '../../../components/Input'
import { Button } from '../../../components/Button'
import WELogo from '../../../resources/images/we-logo-small.svg'
import { RouteName } from '../../../router/segments'
import { FormErrors } from '../constants'

const Container = styled.div`
  width: 376px;
`

const LoginInfoContainer = styled.div`
  display: flex;
  font-size: 15px;
  line-height: 16px;
  color: #FFFFFF;
`

const WELogoWrapper = styled.div`
  background-image: url(${WELogo});
  width: 32px;
  height: 32px;
  background-size: 32px;
  background-repeat: no-repeat;
`

const LoginInfoText = styled.div`
  margin-left: 8px;
  font-weight: 300;
`

const AdditionalText = styled.span`
  font-weight: 300;
  font-size: 15px;
  color: white;
  cursor: pointer;
`

const SignIn = () => {
  const { api, authStore } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const onChangeLogin = (e: any) => {
    setUsername(e.target.value)
  }

  const onChangePassword = (e: any) => {
    setPassword(e.target.value)
  }

  const validateForm = () => {
    const usernameErrors = []
    const passwordErrors = []
    if (!username) {
      usernameErrors.push(FormErrors.EnterAnEmail)
    }
    if (!password) {
      passwordErrors.push(FormErrors.EnterAPassword)
    }
    setUsernameError(usernameErrors.length ? usernameErrors[0] : '')
    setPasswordError(passwordErrors.length ? passwordErrors[0] : '')
  }

  const onLoginClick = () => {
    // authStore.setLoggedIn(true)
    // router.navigate(RouteName.SignInWallet)
    // validateForm()
    authStore.setLoggedIn(true)
    router.navigate(RouteName.Account)
  }

  return <Container>
    <Input placeholder={'Email'} onChange={onChangeLogin} />
    {usernameError &&
      <InputExplain text={usernameError} />
    }
    <Block16>
      <LoginInfoContainer>
        <WELogoWrapper />
        <LoginInfoText>
          <div>You can use Waves Enterprise account.</div>
          <div>We don’t have any access to it or to your tokens.</div>
        </LoginInfoText>
      </LoginInfoContainer>
    </Block16>
    <Block24 />
    <Input autoComplete='new-password' placeholder={'Password'} type={'password'} onChange={onChangePassword} />
    {passwordError &&
      <InputExplain text={passwordError} />
    }
    <Block16 style={{ 'textAlign': 'right' }}>
      <AdditionalText>Forgot password</AdditionalText>
    </Block16>
    <Block marginTop={65} />
    <Button type={'primary'} onClick={onLoginClick}>Login</Button>
  </Container>
}

export default SignIn
