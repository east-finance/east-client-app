import React, { useState } from 'react'
import { Link, useRoute } from 'react-router5'
import { Block, Block16, Block24, Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Button } from '../../../components/Button'

const Container = styled.div`
  width: 376px;
`

const SignInWallet = () => {
  const { api, authStore } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return <Container>
    123
  </Container>
}

export default SignInWallet
