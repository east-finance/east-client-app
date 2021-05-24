import React, { useState } from 'react'
import { useRoute } from 'react-router5'
import { Block, Block24 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input, InputStatus } from '../../../components/Input'
import { Button } from '../../../components/Button'
import { validateEmail } from '../utils'
import { FormErrors } from '../constants'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorNotification } from '../../../components/Notification'

const Container = styled.div`
  width: 376px;
`

const SignUp = () => {
  const { api } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState(InputStatus.default)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [passwordStatus, setPasswordStatus] = useState(InputStatus.default)
  const [inProgress, setInProgress] = useState(false)

  const validateForm = () => {
    let uStatus = InputStatus.default
    let passStatus = InputStatus.default
    let msg = ''
    if(!username) {
      msg = FormErrors.EnterAnEmail
    } else if(!validateEmail(username)) {
      msg = FormErrors.EmailIsIncorrect
    }
    if (msg) {
      uStatus = InputStatus.error
    } else {
      if (!password || !confirm) {
        msg = FormErrors.EnterAPassword
      }
      if(msg) {
        passStatus = InputStatus.error
      }
    }
    setUsernameStatus(uStatus)
    setPasswordStatus(passStatus)
    if (msg) {
      toast.dismiss()
      toast(<ErrorNotification text={msg} />, {
        hideProgressBar: true
      })
    }
    return msg
  }

  const onChangeLogin = (e: any) => {
    setUsername(e.target.value)
  }

  const onChangePassword = (e: any) => {
    setPassword(e.target.value)
  }

  const onChangeConfirm = (e: any) => {
    setConfirm(e.target.value)
  }

  const onSignUpClicked = async () => {
    try {
      const formError = validateForm()
      if (formError) {
        toast.dismiss()
        toast(<ErrorNotification text={formError} />, {
          hideProgressBar: true
        })
      } else {
        try {
          setInProgress(true)
          const result = await api.signUp(username, password)
          console.log('Signup result', result)
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
          toast.dismiss()
          toast(<ErrorNotification text={msg} />, {
            hideProgressBar: true,
            autoClose: 5000000
          })
        } finally {
          setInProgress(false)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return <Container>
    <Input placeholder={'Email'} status={usernameStatus} onChange={onChangeLogin} />
    <Block24 />
    <Input placeholder={'Password'} type={'password'} status={passwordStatus} onChange={onChangePassword} />
    <Block24 />
    <Input placeholder={'Confirm password'} type={'password'} status={passwordStatus} onChange={onChangeConfirm} />
    <Block marginTop={54} />
    <Button type={'primary'} onClick={onSignUpClicked}>Sign Up</Button>
  </Container>
}

export default SignUp
