import React from 'react'
import { useRoute } from 'react-router5'
import { Block, Block16 } from '../../../components/Block'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import { Button } from '../../../components/Button'
import { observer } from 'mobx-react'
import { RouteName } from '../../../router/segments'

const Container = styled.div`
  margin: 0 auto;
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

  const walletButtonText = isMobile
    ? 'Use WE Wallet (desktop-only)'
    : 'Use existing address (WE Wallet)'

  return <Container>
    <Block marginTop={150}>
      <ButtonContainer>
        <Button type={'primary'} disabled={isMobile} onClick={() => router.navigate(RouteName.SignInWallet)}>
          {walletButtonText}
        </Button>
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
