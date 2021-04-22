import React, { useState } from 'react'
import { Link, useRoute } from 'react-router5'
import { Block, Block16, Block24, Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input } from '../../../components/Input'
import { Button } from '../../../components/Button'
import WELogo from '../../../resources/images/we-logo-small.svg'
import { RouteName } from '../../../router/segments'

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
`

const SignIn = () => {
  const { api, authStore } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onChangeLogin = (e: any) => {
    console.log('onChangeLogin', e.target.value)
  }

  const onChangePassword = (e: any) => {
    console.log('onChangePassword', e.target.value)
  }

  const onLoginClick = () => {
    // authStore.setLoggedIn(true)
    router.navigate(RouteName.SignInWallet)
  }

  return <Container>
    <Input placeholder={'Email'} onChange={onChangeLogin} />
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
    <Input placeholder={'Password'} type={'password'} onChange={onChangePassword} />
    <Block marginTop={54} />
    <Button type={'primary'} onClick={onLoginClick}>Login</Button>
  </Container>
}

export default SignIn
