import React, { useState } from 'react'
import { Link, useRoute } from 'react-router5'
import { Block, Block16, Block24, Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input, InputExplain } from '../../../components/Input'
import { Button } from '../../../components/Button'
import { RouteName } from '../../../router/segments'
import { FormErrors } from '../constants'
import { validateEmail } from '../utils'

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
  const { api, authStore } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState(localStorage.getItem('test_login') || '')
  const [usernameError, setUsernameError] = useState('')

  const onChangeEmail = (e: any) => {
    setUsername(e.target.value)
  }

  const validateForm = () => {
    const usernameErrors = []
    if (!username) {
      usernameErrors.push(FormErrors.EnterAnEmail)
    }
    if(!validateEmail(username)) {
      usernameErrors.push(FormErrors.EmailIsIncorrect)
    }
    setUsernameError(usernameErrors.length ? usernameErrors[0] : '')
  }

  const onSendRecoverClick = async () => {
    try {
      validateForm()
      if (!usernameError) {
        const res = await api.sendPasswordRecover(username)
        console.log('result', res)
      }
    } catch (e) {
      console.log('Login error:', e)
    }
  }

  return <Container>
    <Block marginTop={158} />
    <Input placeholder={'Email'} onChange={onChangeEmail} autoFocus={true} />
    {usernameError &&
      <InputExplain text={usernameError} />
    }
    <Block16>
      <span>Enter your email, we will send recovery instructions.</span>
    </Block16>
    <Block marginTop={130}>
      <Button type={'primary'} onClick={onSendRecoverClick}>Reset password</Button>
    </Block>
    <Block marginTop={24}>
      <AdditionalText onClick={() => router.navigate(RouteName.SignIn)}>I remembered my password</AdditionalText>
    </Block>
  </Container>
}

export default PasswordRecovery
