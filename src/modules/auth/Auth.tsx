import React from 'react'
import { Route, useRoute } from 'react-router5'
import styled from 'styled-components'
import { Tabs } from '../../components/Tabs'
import { Block } from '../../components/Block'
import { buildRouteName, RouteName, RouteSegment } from '../../router/segments'
import SignIn from './sign-in/SignIn'
import SignUp from './sign-up/SignUp'
import gradientBackground from '../../resources/images/gradient-bg1.png'
import SignInWallet from './sign-in/SignInWallet'

const Container = styled.div`
  // margin-top: ${props => props.theme.defaultMarginTop};
  padding-top: ${props => props.theme.defaultMarginTop};
  background-image: url(${gradientBackground});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
`

const Title = styled.div`
  text-align: center;
  letter-spacing: -1px;
  font-weight: 800;
  font-size: 48px;
  color: white;
  font-family: BrutalType,Helvetica,Arial,sans-serif;
`

const Auth: React.FunctionComponent = () =>  {
  const { route: { name: routeName }, router } = useRoute()
  let content = null

  const tabsProps = {
    defaultActiveId: RouteSegment.signIn,
    items: [{
      id: RouteSegment.signIn,
      name: 'Login',
      content: <Block marginTop={40}>
        <SignIn />
      </Block>
    }, {
      id: RouteSegment.signUp,
      name: 'Sign up',
      content: <Block marginTop={40}>
        <SignUp />
      </Block>
    }],
    onSelectTab: (id: string) => {
      router.navigate(buildRouteName(RouteSegment.auth, id))
    }
  }
  if ([RouteName.SignIn, RouteName.SignUp].includes(routeName)) {
    content = <Tabs {...tabsProps} />
  } else if(routeName === RouteName.SignInWallet) {
    content = <SignInWallet />
  } else {
    content = <div>Another auth content</div>
  }
  return <Container>
    <Title>Welcome to EAST</Title>
    <Block marginTop={28} />
    {content}
  </Container>
}

export default Auth
