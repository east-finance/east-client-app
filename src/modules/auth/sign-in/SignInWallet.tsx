import React, { useState } from 'react'
import { Link, useRoute } from 'react-router5'
import { Block, Block16, Block24, Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Button, NavigationLeft } from '../../../components/Button'

const Container = styled.div`
  width: 640px;
  margin: 0 auto;
`

const Description = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
`

const PrimaryDescription = styled(Description)`
  font-size: 20px;
`

const ButtonContainer = styled.div`
  width: 376px;
  margin: 0 auto;
`

const SignInWallet = () => {
  const { api, authStore } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return <Container>
    <Block marginTop={98} />
    <PrimaryDescription>We could not find WE Wallet extension</PrimaryDescription>
    <Block marginTop={40} />
    <Description>
      To use existing address from Waves Enterprise blockchain, you need to install Waves Enterprise Wallet from Google Chrome Web Store
    </Description>
    <Block marginTop={64} />
    <ButtonContainer>
      <Button>Go to Chrome Web Store</Button>
    </ButtonContainer>
  </Container>
}

export default SignInWallet
