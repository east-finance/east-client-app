import React, { useEffect, useState } from 'react'
import { useRoute } from 'react-router5'
import decodeJWT, { JwtPayload } from 'jwt-decode'
import { Block, Block16 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { AuthError } from '../../../api/apiErrors'
import { RouteName } from '../../../router/segments'
import { Button } from '../../../components/Button'

const Container = styled.div`
  @media screen and (min-width: 900px) {
    width: 376px;
  }
  margin: 0 auto;
`

const H3 = styled.div`
  font-weight: 600;
  font-size: 22px;
`

const PrimaryText = styled.div`
  font-weight: 600;
  font-size: 20px;
`

const SecondaryText = styled.div`
  font-weight: 300;
  font-size: 16px;
`

const NoTokenProvided = () => {
  return <div>
    <PrimaryText>No token provided.</PrimaryText>
    <SecondaryText>Check confirmation email.</SecondaryText>
  </div>
}

const ConfirmationInProgress = (props: { token: string }) => {
  const [counter, setCounter] = useState(3)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const c = (counter + 1) % 4
      setCounter(c)
    }, 500)
    return () => {
      clearInterval(intervalId)
    }
  }, [counter])

  return <div>
    <PrimaryText>Confirmation in progress{Array(counter).fill(null).map(_ => '.')}</PrimaryText>
    <SecondaryText>tokenId: {props.token}</SecondaryText>
  </div>
}

const ConfirmationError = (props: { token: string; errorCode: string; errorMessage: string; confirmUser: () => void }) => {
  const { token, errorMessage } = props
  const { router } = useRoute()
  return <div>
    <PrimaryText>Confirmation error</PrimaryText>
    <SecondaryText>{errorMessage}</SecondaryText>
    <SecondaryText>tokenId: {token}</SecondaryText>
    <Block16>
      <Button type={'primary'} onClick={() => router.navigate(RouteName.SignIn)}>Log in to EAST</Button>
    </Block16>
  </div>
}

const ConfirmationSuccess = (props: { confirmedEmail: string }) => {
  const { router } = useRoute()
  return <div>
    <div style={{ textAlign: 'center' }}>
      <H3>User successfully confirmed</H3>
    </div>
    <Block16>
      <Button type={'primary'} onClick={() => router.navigate(RouteName.SignIn, { email: props.confirmedEmail })}>Log in to EAST</Button>
    </Block16>
  </div>
}

const ConfirmUser = () => {
  const { api } = useStores()
  const { route: { params: { token } } } = useRoute()

  const [inProgress, setInProgress] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorCode, setErrorCode] = useState('')
  const [confirmedEmail, setConfirmedEmail] = useState('')

  const confirmUser = async (confirmationToken: string) => {
    try {
      setInProgress(true)
      const { access_token: accessToken } = await api.confirmUser(confirmationToken)
      try {
        const { name }: JwtPayload & { name: string } = decodeJWT(accessToken)
        setConfirmedEmail(name)
      } catch (e) {
        console.log('Cannot decode jwt:', accessToken)
      }
    } catch (e) {
      console.error('Confirm user error: ', e.message)
      let code = ''
      let msg = e.message
      if (e.response) {
        const { data: { errors = [] } } = e.response
        if (errors) {
          if (errors.includes(AuthError.TokenAlreadyUsed)) {
            code = AuthError.TokenAlreadyUsed
            msg = 'User is already confirmed. You can login to EAST.'
          }
        }
      }
      setErrorCode(code)
      setErrorMessage(msg)
    } finally {
      setInProgress(false)
    }
  }

  useEffect(() => {
    if (token) {
      confirmUser(token)
    }
  }, [token])

  let content = null
  if (!token) {
    content = <NoTokenProvided />
  } else if (inProgress) {
    content = <ConfirmationInProgress token={token} />
  } else if (errorMessage) {
    content = <ConfirmationError token={token} errorMessage={errorMessage} errorCode={errorCode} confirmUser={() => confirmUser(token)} />
  } else {
    content = <ConfirmationSuccess confirmedEmail={confirmedEmail} />
  }

  return <Container>
    <Block marginTop={158}>
      {content}
    </Block>
  </Container>
}

export default ConfirmUser
