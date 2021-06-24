import React, { ChangeEvent, useState } from 'react'
import { useRoute } from 'react-router5'
import { Block, Block16 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input, InputStatus } from '../../../components/Input'
import { Button } from '../../../components/Button'
import { RouteName } from '../../../router/segments'
import { validateEmail } from '../utils'
import { toast } from 'react-toastify'
import { ErrorNotification } from '../../../components/Notification'
import { FormErrors } from '../../../components/PasswordRules'
import { ButtonSpinner, RelativeContainer } from '../../../components/Spinner'
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

const PasswordRecovery = () => {
  const { api } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [inProgress, setInProgress] = useState(false)

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.trim())
  }

  const validateForm = () => {
    let error = ''
    if (!username) {
      error = FormErrors.EnterEmail
    } else if(!validateEmail(username)) {
      error = FormErrors.EmailIsIncorrect
    }
    return error
  }

  const onSendRecoverClick = async () => {
    const err = validateForm()
    if (err) {
      setUsernameError(err)
      // toast.dismiss()
      toast(<ErrorNotification title={err} />, {
        hideProgressBar: true
      })
    } else {
      try {
        setUsernameError('')
        setInProgress(true)
        await api.sendPasswordRecover(username)
        setEmailSent(true)
      } catch (e) {
        console.error('Recover error:', e.message)
        let toastMessage = 'Unknown error. Try again later.'
        let toastTitle = ''
        if (e.response) {
          const { data: { errors } } = e.response
          if (errors.includes('email must be an email')) {
            toastMessage = FormErrors.EmailIsIncorrect
            setUsernameError(FormErrors.EmailIsIncorrect)
          } else if (errors.includes(AuthError.TooManyRequests)) {
            toastMessage = 'Too many requests'
            toastTitle = 'Try to send mail later or check mailbox'
          }
        }
        toast(<ErrorNotification title={toastTitle} message={toastMessage} />, {
          hideProgressBar: true
        })
      } finally {
        setInProgress(false)
      }
    }
  }

  return <Container>
    <Block marginTop={158}>
      {!emailSent &&
        <div>
          <Input placeholder={'Email'} status={usernameError ? InputStatus.error : InputStatus.default} onChange={onChangeEmail} autoFocus={true} />
          <Block16>
            <span>Enter your email, we will send recovery instructions.</span>
          </Block16>
        </div>
      }
      {emailSent &&
        <AdditionalText>
          <div>
            If {username} is registered, you will receive an email with instructions on how to reset your password.
          </div>
          <div>
            If this email is not in your Inbox, please check Spam.
          </div>
        </AdditionalText>
      }
    </Block>
    <Block marginTop={130}>
      {emailSent &&
        <Button type={'primary'} onClick={() => {
          setUsernameError('')
          setEmailSent(false)
        }}>
          Send another email
        </Button>
      }
      {!emailSent &&
        <Button type={'primary'} disabled={inProgress} onClick={onSendRecoverClick}>
          <RelativeContainer>
            {inProgress && <ButtonSpinner />}
            Reset password
          </RelativeContainer>
        </Button>
      }
    </Block>
    <Block marginTop={24}>
      <AdditionalText onClick={() => router.navigate(RouteName.SignIn)}>I remembered my password</AdditionalText>
    </Block>
  </Container>
}

export default PasswordRecovery
