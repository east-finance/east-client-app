import React, { ChangeEvent, useState } from 'react'
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
import { AuthError } from '../../../api/apiErrors'
import { ButtonSpinner, RelativeContainer } from '../../../components/Spinner'
import { observer } from 'mobx-react'

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

const SignIn = observer(() => {
  const { authStore } = useStores()
  const { router, route } = useRoute()

  const [username, setUsername] = useState(localStorage.getItem('test_login') || route.params.email || '')
  const [password, setPassword] = useState(localStorage.getItem('test_pass') || '')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [inProgress, setInProgress] = useState(false)

  const onChangeLogin = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.trim())
  }

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.trim())
  }

  const validateForm = () => {
    let userMessage = ''
    let passMessage = ''
    if (!username) {
      userMessage = FormErrors.EnterEmail
    } else {
      if(!validateEmail(username)) {
        userMessage = FormErrors.EmailIsIncorrect
      }
      if (!password) {
        passMessage = FormErrors.EnterPassword
      }
    }
    return {
      userMessage,
      passMessage
    }
  }

  const onLoginClick = async () => {
    if (!inProgress) {
      const { userMessage, passMessage } = validateForm()
      setUsernameError(userMessage)
      setPasswordError(passMessage)
      const msg = userMessage || passMessage
      if (msg) {
        toast.dismiss()
        toast(<ErrorNotification title={msg} />, {
          hideProgressBar: true
        })
      } else {
        let tokenPair = null
        const onRefreshFailed = () => {
          if (authStore.isLoggedIn) {
            toast(<ErrorNotification title={'Logged out'} message={'Auth token is expired, sign in again'} />, {
              hideProgressBar: true
            })
            authStore.logout()
          }
        }
        try {
          setInProgress(true)
          tokenPair = await authStore.signIn(username, password, onRefreshFailed)
        } catch (e) {
          let toastText = 'Unknown error. Try again later.'
          if (e.response) {
            const { errors } =  e.response.data
            setUsernameError('login_error')
            setPasswordError('login_error')
            if (errors.includes(AuthError.UserNotFound)) {
              toastText = 'Account with this email is not found'
            } else if (errors.includes(AuthError.WrongPassword)) {
              toastText = 'Wrong password'
            } else if (errors.includes(AuthError.UserShouldBeConfirmed)) {
              toastText = 'Account is not confirmed'
            }
          }
          toast.dismiss()
          toast(<ErrorNotification title={toastText} />, {
            hideProgressBar: true
          })
        } finally {
          setInProgress(false)
        }

        if (tokenPair) {
          authStore.loginWithTokenPair(tokenPair)
          router.navigate(RouteName.SignInWallet)
        }
      }
    }
  }

  const onLoginPressed = (e: any) => {
    if(e.keyCode === 13) {
      if (!inProgress) {
        e.preventDefault()
        onLoginClick()
      }
    }
  }

  return <Container>
    <Input
      autoFocus={true}
      status={usernameError ? InputStatus.error : InputStatus.default}
      placeholder={'Email'}
      defaultValue={username}
      onChange={onChangeLogin}
      onKeyDown={onLoginPressed}
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
      defaultValue={password}
      onChange={onChangePassword}
      onKeyDown={onLoginPressed}
    />
    <Block16 style={{ 'textAlign': 'right' }}>
      <AdditionalText onClick={() => router.navigate(RouteName.PasswordRecovery)}>Forgot password</AdditionalText>
    </Block16>
    <Block marginTop={65} />
    <Button type={'primary'} disabled={inProgress} onClick={onLoginClick}>
      <RelativeContainer>
        {inProgress && <ButtonSpinner />}
        Login
      </RelativeContainer>
    </Button>
  </Container>
})

export default SignIn