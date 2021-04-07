import React from 'react'
import { useRoute } from 'react-router5'
import styled from 'styled-components'
import { Tabs } from '../../components/Tabs'
import { Block } from '../../components/Block'
import { RouteName } from '../../router/segments'
import SignIn from './sign-in/SignIn'
import SignUp from './sign-up/SignUp'

const Container = styled.div`
  margin-top: ${props => props.theme.defaultMarginTop};
`

const Title = styled.div`
  text-align: center;
  letter-spacing: -1px;
  font-weight: bold;
  font-size: 32px;
`

const Auth: React.FunctionComponent = () =>  {
  const { route: { name: routeName } } = useRoute()
  let content = null

  const tabsProps = {
    defaultActiveId: 'Login',
    items: [{
      id: 'Login',
      name: 'Login',
      content: <Block marginTop={67}>
        <SignIn />
      </Block>
    }, {
      id: 'Register',
      name: 'Register',
      content: <Block marginTop={67}>
        <SignUp />
      </Block>
    }]
  }
  const tabs = <Tabs {...tabsProps} />
  if (routeName.startsWith(RouteName.SignIn)) {
    // content = <SignIn />
    content = tabs
  } else {
    content = <div>Another auth content</div>
  }
  return <Container>
    <Title>EAST</Title>
    <Block marginTop={28} />
    {content}
  </Container>
}

export default Auth
