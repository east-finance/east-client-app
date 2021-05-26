import React, { useState } from 'react'
import { useRoute } from 'react-router5'
import { Block, Block16, Block24 } from '../../../components/Block'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import useStores from '../../../hooks/useStores'
import { Input, InputStatus } from '../../../components/Input'
import { Button } from '../../../components/Button'
import WELogo from '../../../resources/images/we-logo-small.svg'
import { RouteName } from '../../../router/segments'
import { validateEmail } from '../utils'
import { ErrorNotification } from '../../../components/Notification'
import { FormErrors } from '../../../components/PasswordRules'

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
  font-weight: 600;
  font-size: 15px;
  color: white;
  cursor: pointer;
`

const SignIn = () => {
  const { api, authStore } = useStores()
  const { router, route } = useRoute()

  const [username, setUsername] = useState(localStorage.getItem('test_login') || route.params.email || '')
  const [password, setPassword] = useState(localStorage.getItem('test_pass') || '')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [inProgress, setInProgress] = useState(false)

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
      usernameErrors.push(FormErrors.EnterEmail)
    } else {
      if(!validateEmail(username)) {
        usernameErrors.push(FormErrors.EmailIsIncorrect)
      }
      if (!password) {
        passwordErrors.push(FormErrors.EnterPassword)
      }
    }
    setUsernameError(usernameErrors.length ? usernameErrors[0] : '')
    setPasswordError(passwordErrors.length ? passwordErrors[0] : '')
  }

  const onLoginClick = async () => {
    if (!inProgress) {
      validateForm()
      if (!usernameError && !passwordError) {
        let tokenPair = null
        try {
          setInProgress(true)
          tokenPair = await api.signIn(username, password)
        } catch (e) {
          let toastText = 'Unknown error. Try again later'
          if (e.response) {
            const { errors } =  e.response.data
            setUsernameError('login_error')
            setPasswordError('login_error')
            if (errors.includes('user.not.found') || errors.includes('wrong.password')) {
              toastText = 'Wrong email or password'
            }
          }
          // toast.dismiss()
          toast(<ErrorNotification text={toastText} />, {
            hideProgressBar: true
          })
        } finally {
          setInProgress(false)
        }

        if (tokenPair) {
          authStore.loginWithTokenPair(tokenPair)
          router.navigate(RouteName.SignInWallet)
        }
      } else {
        // const msg = usernameError || passwordError
        // toast(<ErrorNotification text={msg} />, {
        //   hideProgressBar: true
        // })
      }
    }
  }

  return <Container>
    <Input
      autoFocus={true}
      status={usernameError ? InputStatus.error : InputStatus.default}
      placeholder={'Email'}
      value={username}
      onChange={onChangeLogin}
    />
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
    <Input
      autoComplete='new-password'
      status={passwordError ? InputStatus.error : InputStatus.default}
      placeholder={'Password'}
      type={'password'}
      value={password}
      onChange={onChangePassword}
    />
    <Block16 style={{ 'textAlign': 'right' }}>
      <AdditionalText onClick={() => router.navigate(RouteName.PasswordRecovery)}>Forgot password</AdditionalText>
    </Block16>
    <Block marginTop={65} />
    <Button type={'primary'} onClick={onLoginClick}>Login</Button>
  </Container>
}

export default SignIn
