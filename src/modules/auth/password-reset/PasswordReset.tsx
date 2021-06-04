import React, { useState } from 'react'
import { useRoute } from 'react-router5'
import { Block, Block16, Block24, Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input, InputStatus, InputTooltip } from '../../../components/Input'
import { Button } from '../../../components/Button'
import { RouteName } from '../../../router/segments'
import { FormErrors, getPasswordStrength, PasswordRules } from '../../../components/PasswordRules'
import { toast } from 'react-toastify'
import { ErrorNotification } from '../../../components/Notification'
import { AuthError } from '../../../api/apiErrors'

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
`

const AdditionalText = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  color: white;
  cursor: pointer;
`

const PrimaryText = styled.div`
  font-weight: 600;
  font-size: 18px;
`

const SecondaryText = styled.div`
  font-weight: 300;
  font-size: 15px;
`

const InputWrapper = styled.div`
  position: relative;
`

const PasswordRecovery = () => {
  const { api } = useStores()
  const { router, route } = useRoute()
  const { params: { email, token }} = route

  const [password, setPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [isPasswordFocused, setPasswordFocused] = useState(false)

  const [confirm, setConfirm] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [isConfirmFocused, setConfirmFocused] = useState(false)

  const [inProgress, setInProgress] = useState(false)
  const [apiError, setApiError] = useState('')
  const [isRestoreEmailSent, setRestoreEmailSent] = useState(false)
  const [isPasswordChanged, setPasswordChanged] = useState(false)

  const validateForm = () => {
    let passMessage = ''
    let confMessage = ''
    if (!password) {
      passMessage = FormErrors.EnterPassword
    } else {
      const passwordRulesErrors = getPasswordStrength(password)
      if (passwordRulesErrors.length > 0) {
        passMessage = FormErrors.PasswordRules
      } else {
        if (!confirm) {
          confMessage = FormErrors.EnterConfirm
        } else if (password !== confirm) {
          confMessage = FormErrors.PasswordsNotMatch
        }
      }
    }
    return {
      passMessage,
      confMessage
    }
  }

  const onContinueClicked = async () => {
    const { passMessage, confMessage } = validateForm()

    setPasswordMessage(passMessage)
    setConfirmMessage(confMessage)

    const msg = passMessage || confMessage

    if (msg) {
      if (msg !== FormErrors.PasswordRules) {
        toast(<ErrorNotification text={msg} />, {
          hideProgressBar: true
        })
      }
    } else {
      try {
        setInProgress(true)
        const result = await api.resetPassword(token, password)
        console.log('result', result)
        setPasswordMessage('')
        setConfirmMessage('')
        setPasswordChanged(true)
      } catch (e) {
        console.error('Reset password error:', e.message)
        let msg = 'Unknown error. Try again later.'
        if (e.response) {
          const { data: { errors } } = e.response
          console.log('response data', errors)
          if (errors.includes(AuthError.TokenExpired) || errors.includes(AuthError.TokenAlreadyUsed)) {
            msg = 'Reset token is expired'
            setApiError(AuthError.TokenExpired)
          }
        }
        toast(<ErrorNotification text={msg} />, {
          hideProgressBar: true
        })
      } finally {
        setInProgress(false)
      }
    }
  }

  const sendRestoreEmail = async () => {
    try {
      await api.sendPasswordRecover(email)
      setRestoreEmailSent(true)
    } catch (e) {
      console.error('Error on send restore email:', e.message)
      toast(<ErrorNotification text={'Error on send restore email'} />, {
        hideProgressBar: true
      })
    }
  }

  return <Container>
    <Block marginTop={96}>
      <PrimaryText>Your email: {email}</PrimaryText>
      {(apiError === AuthError.TokenExpired || apiError === AuthError.TokenAlreadyUsed) &&
        <Block32>
          {isRestoreEmailSent && <div>
            <PrimaryText>Restore email was sent. Check your mail.</PrimaryText>
          </div>}
          {!isRestoreEmailSent && <div>
            <PrimaryText>Reset token was expired.</PrimaryText>
            <SecondaryText>To reset password, send another restore email.</SecondaryText>
            <Block marginTop={16}>
              <Button type={'primary'} onClick={sendRestoreEmail}>Send restore email</Button>
            </Block>
          </div>}
        </Block32>
      }
      {(!apiError && !isPasswordChanged) &&
        <div>
          <Block16>
            <SecondaryText>Create a strong password</SecondaryText>
          </Block16>
          <Block32>
            <InputWrapper>
              <Input
                type={'password'}
                autoComplete={'new-password'}
                placeholder={'New password'}
                status={passwordMessage ? InputStatus.error : InputStatus.default}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <InputTooltip isVisible={isPasswordFocused || !!passwordMessage}>
                <PasswordRules password={password} />
              </InputTooltip>
            </InputWrapper>
            <Block24>
              <InputWrapper>
                <Input
                  type={'password'}
                  autoComplete={'new-password'}
                  placeholder={'Confirm new password'}
                  status={confirmMessage ? InputStatus.error : InputStatus.default}
                  onChange={(e) => setConfirm(e.target.value)}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                />
                <InputTooltip isVisible={isConfirmFocused || !!confirmMessage}>
                  <PasswordRules password={confirm} />
                </InputTooltip>
              </InputWrapper>
            </Block24>
          </Block32>
          <Block marginTop={24}>
            <Button type={'primary'} onClick={onContinueClicked}>Reset password</Button>
          </Block>
          <Block marginTop={32}>
            <AdditionalText onClick={() => router.navigate(RouteName.SignIn, { email })}>I remembered my password</AdditionalText>
          </Block>
        </div>
      }
      {(!apiError && isPasswordChanged) &&
        <Block32>
          <PrimaryText>Password was successfully changed.</PrimaryText>
          <SecondaryText>Use it to log in.</SecondaryText>
          <Block marginTop={16}>
            <Button type={'primary'} onClick={() => router.navigate(RouteName.SignIn, { email })}>Log in to EAST client</Button>
          </Block>
        </Block32>
      }
    </Block>
  </Container>
}

export default PasswordRecovery
