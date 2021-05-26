import React, { useState } from 'react'
import { useRoute } from 'react-router5'
import { Block, Block16, Block24 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input, InputStatus, InputTooltip } from '../../../components/Input'
import { Button } from '../../../components/Button'
import { validateEmail } from '../utils'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorNotification } from '../../../components/Notification'
import { FormErrors, getPasswordStrength, PasswordRules } from '../../../components/PasswordRules'

const Container = styled.div`
  width: 376px;
`

const InputWrapper = styled.div`
  position: relative;
`

const SuccessMessage =  styled.div`
  font-size: 18px;
  font-weight: 500;
`

const SignUp = () => {
  const { api } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState(InputStatus.default)
  const [password, setPassword] = useState('')
  const [isPasswordFocused, setPasswordFocused] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState(InputStatus.default)
  const [confirm, setConfirm] = useState('')
  const [isConfirmFocused, setConfirmFocused] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [isRegistered, setRegistered] = useState(false)

  const onChangeLogin = (e: any) => setUsername(e.target.value)
  const onChangePassword = (e: any) => setPassword(e.target.value)
  const onChangeConfirm = (e: any) => setConfirm(e.target.value)

  const validateForm = () => {
    let uStatus = InputStatus.default
    let passStatus = InputStatus.default
    let message = ''
    if(!username) {
      message = FormErrors.EnterEmail
    } else if(!validateEmail(username)) {
      message = FormErrors.EmailIsIncorrect
    }
    if (message) {
      uStatus = InputStatus.error
    } else {
      if(!password) {
        message = 'Enter a password'
      } else if (!confirm) {
        message = 'Confirm password'
      } else {
        if (password !== confirm) {
          message = 'Passwords didn\'t match'
        }
      }
      if(message) {
        passStatus = InputStatus.error
      }
    }
    const passwordRulesErrors = getPasswordStrength(password)
    if (passwordRulesErrors.length > 0) {
      passStatus = InputStatus.error
    }
    return {
      message,
      uStatus,
      passStatus
    }
  }

  const onSignUpClicked = async () => {
    // toast.dismiss()
    const { message, uStatus, passStatus } = validateForm()
    setUsernameStatus(uStatus)
    setPasswordStatus(passStatus)
    if ([uStatus, passStatus].includes(InputStatus.error)) {
      if (message) {
        toast(<ErrorNotification text={message} />, {
          hideProgressBar: true
        })
      }
    } else {
      try {
        setInProgress(true)
        await api.signUp(username, password)
        setUsernameStatus(InputStatus.default)
        setPasswordStatus(InputStatus.default)
        setRegistered(true)
      } catch (e) {
        console.log('Signup error:', e.message)
        const { errors } =  e.response.data
        let msg = 'Unknown error. Try again later.'
        let uStatus = InputStatus.default
        let passStatus = InputStatus.default
        if (errors.includes('user.already.exists')) {
          msg = 'User already exists'
          uStatus = InputStatus.error
        } else if(errors.includes('password.does.not.meet.the.requirements')) {
          msg = 'Password does not meet the requirements'
          passStatus = InputStatus.error
        }
        setUsernameStatus(uStatus)
        setPasswordStatus(passStatus)
        toast(<ErrorNotification text={msg} />, {
          hideProgressBar: true
        })
      } finally {
        setInProgress(false)
      }
    }
  }

  return <Container>
    {!isRegistered &&
      <div>
        <Input placeholder={'Email'} status={usernameStatus} onChange={onChangeLogin} />
        <Block24>
          <InputWrapper>
            <Input
              placeholder={'Password'}
              type={'password'}
              status={passwordStatus}
              onChange={onChangePassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <InputTooltip isVisible={isPasswordFocused}>
              <PasswordRules password={password} />
            </InputTooltip>
          </InputWrapper>
        </Block24>
        <Block24>
          <InputWrapper>
            <Input
              placeholder={'Confirm password'}
              type={'password'}
              status={passwordStatus}
              onChange={onChangeConfirm}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
            />
            <InputTooltip isVisible={isConfirmFocused}>
              <PasswordRules password={confirm} />
            </InputTooltip>
          </InputWrapper>
        </Block24>
        <Block marginTop={54}>
          <Button type={'primary'} onClick={onSignUpClicked}>Sign Up</Button>
        </Block>
      </div>
    }
    {isRegistered &&
      <Block24>
        <SuccessMessage style={{ textAlign: 'center' }}>Complete registration</SuccessMessage>
        <Block16>
          <SuccessMessage>We sent an email to {username}. Follow the link to confirm your e-mail and access the application.</SuccessMessage>
        </Block16>
        <Block marginTop={54}>
          <Button type={'primary'} onClick={() => setRegistered(false)}>Sign Up again</Button>
        </Block>
      </Block24>
    }
  </Container>
}

export default SignUp
