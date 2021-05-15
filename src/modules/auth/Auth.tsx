import React from 'react'
import { Route, useRoute } from 'react-router5'
import styled from 'styled-components'
import { Tabs } from '../../components/Tabs'
import { Block } from '../../components/Block'
import { buildRouteName, RouteName, RouteSegment } from '../../router/segments'
import SignIn from './sign-in/SignIn'
import SignUp from './sign-up/SignUp'
import gradientBackground from '../../resources/images/gradient-bg1.png'
import EastLogo from '../../resources/images/east-logo.svg'
import SignInWallet from './sign-in/SignInWallet'
import { NavigationLeft } from '../../components/Button'
import PasswordRecovery from './password-recovery/PasswordRecovery'

const Container = styled.div`
  position: relative;
  min-width: 400px;
  // margin-top: ${props => props.theme.defaultMarginTop};
  padding-top: ${props => props.theme.defaultMarginTop};
  box-sizing: border-box;
  background-image: url(${gradientBackground});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  min-height: 100vh;
  width: 100%;
  color: white;
`

const EastLogoWrapper = styled.div`
  position: absolute;
  top: 32px;
  left: 37px;
  width: 174px;
  height: 55px;
  background-image: url(${EastLogo});
`

const Title = styled.div`
  text-align: center;
  letter-spacing: -1px;
  font-weight: 800;
  font-size: 48px;
  color: white;
  font-family: BrutalType,Helvetica,Arial,sans-serif;
`

const NavigationContainer = styled.div`
  position: absolute;
  left: 40px;
  top: 332px;
`

const Auth: React.FunctionComponent = () =>  {
  const { route: { name: routeName }, router } = useRoute()
  let content = null
  let title = ''

  const tabsProps = {
    defaultActiveId: routeName === RouteName.SignUp ? RouteSegment.signUp : RouteSegment.signIn,
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
    content = <Block marginTop={40}>
      <Tabs {...tabsProps} />
    </Block>
    title = 'Welcome to EAST'
  } else if(routeName === RouteName.SignInWallet) {
    content = <div>
      <NavigationContainer>
        <NavigationLeft onClick={() => {
          router.navigate(RouteName.SignIn)
        }} />
      </NavigationContainer>
      <SignInWallet />
    </div>
    title = 'Login with WE Wallet'
  } else if(routeName === RouteName.PasswordRecovery) {
    title = 'Password recovery'
    content = <PasswordRecovery />
  } else {
    content = <div>Another auth content</div>
  }
  return <Container>
    <EastLogoWrapper />
    {title &&
      <Title>{title}</Title>
    }
    {content}
  </Container>
}

export default Auth
