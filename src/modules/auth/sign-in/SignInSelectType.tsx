import React from 'react'
import { useRoute } from 'react-router5'
import { Block, Block16 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Button } from '../../../components/Button'
import { observer } from 'mobx-react'
import { RouteName } from '../../../router/segments'

const Container = styled.div`
  margin: 0 auto;
`

const Description = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
`

const ButtonContainer = styled.div`
  width: 376px;
  margin: 0 auto;
`

const InfoContainer = styled.div`
  text-align: center;
  font-size: 15px;
  line-height: 20px;
`

const SignInSelectType = observer(() => {
  const { router } = useRoute()

  return <Container>
    <Block marginTop={150}>
      <ButtonContainer>
        <Button type={'primary'} onClick={() => router.navigate(RouteName.SignInWallet)}>Use existing address (Waves Enterprise Wallet)</Button>
        <Block16>
          <InfoContainer>
            Secure way to connect your WE wallet to EAST
          </InfoContainer>
        </Block16>
        <Block marginTop={32}>
          <Button type={'primary'} onClick={() => router.navigate(RouteName.SignInSeed)}>Enter SEED phrase</Button>
        </Block>
      </ButtonContainer>
    </Block>
  </Container>
})

export default SignInSelectType
