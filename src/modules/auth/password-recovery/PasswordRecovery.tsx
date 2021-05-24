import React, { useState } from 'react'
import { useRoute } from 'react-router5'
import { Block, Block16 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input, InputStatus } from '../../../components/Input'
import { Button } from '../../../components/Button'
import { RouteName } from '../../../router/segments'
import { FormErrors } from '../constants'
import { validateEmail } from '../utils'
import { toast } from 'react-toastify'
import { ErrorNotification } from '../../../components/Notification'

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

  const onChangeEmail = (e: any) => {
    setUsername(e.target.value)
  }

  const validateForm = () => {
    let error = ''
    if (!username) {
      error = FormErrors.EnterAnEmail
    } else if(!validateEmail(username)) {
      error = FormErrors.EmailIsIncorrect
    }
    return error
  }

  const onSendRecoverClick = async () => {
    try {
      const err = validateForm()
      if (err) {
        setUsernameError(err)
        toast.dismiss()
        toast(<ErrorNotification text={err} />, {
          hideProgressBar: true
        })
      } else {
        await api.sendPasswordRecover(username)
        setEmailSent(true)
      }
    } catch (e) {
      console.error('Recover error:', e.message)
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
        <Button type={'primary'} onClick={() => setEmailSent(false)}>
          Send another email
        </Button>
      }
      {!emailSent &&
        <Button type={'primary'} onClick={onSendRecoverClick}>
          Reset password
        </Button>
      }
    </Block>
    <Block marginTop={24}>
      <AdditionalText onClick={() => router.navigate(RouteName.SignIn)}>I remembered my password</AdditionalText>
    </Block>
  </Container>
}

export default PasswordRecovery
