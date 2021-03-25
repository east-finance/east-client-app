import React from 'react'
import { useRoute } from 'react-router5'
import styled from 'styled-components'
import { RouteName } from '../../router/segments'
import SignIn from './sign-in/SignIn'

const Container = styled.div`
  margin-top: ${props => props.theme.defaultMarginTop};
`

const Auth: React.FunctionComponent = () =>  {
  const { route: { name: routeName } } = useRoute()
  let content = null
  if (routeName.startsWith(RouteName.SignIn)) {
    content = <SignIn />
  } else {
    content = <div>Another auth content</div>
  }
  return <Container>
    {content}
  </Container>
}

export default Auth
