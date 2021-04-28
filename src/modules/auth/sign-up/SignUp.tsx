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

  const validateForm = () => {
    let usernameStatus = InputStatus.default
    let passwordStatus = InputStatus.default
    let msg = ''
    if(!username) {
      msg = FormErrors.EnterAnEmail
    } else if(!validateEmail(username)) {
      msg = FormErrors.EmailIsIncorrect
    }
    if (msg) {
      usernameStatus = InputStatus.error
    } else {
      if (!password || !confirm) {
        msg = FormErrors.EnterAPassword
      }
      if(msg) {
        passwordStatus = InputStatus.error
      }
    }
    setUsernameStatus(usernameStatus)
    setPasswordStatus(passwordStatus)
    console.log('msgmsgmsg', msg)
    if (msg) {
      toast(msg)
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
      toast('123')
      const formError = validateForm()
      if(!formError) {
        const result = await api.signUp(username, password)
        console.log('result', result)
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
