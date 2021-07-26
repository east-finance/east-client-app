import React from 'react'
import { Route, useRoute } from 'react-router5'
import styled from 'styled-components'
import { Tabs } from '../../components/Tabs'
import { Block } from '../../components/Block'
import { buildRouteName, RouteName, RouteSegment } from '../../router/segments'
import SignIn from './sign-in/SignIn'
import SignUp from './sign-up/SignUp'
import gradientBackground from '../../resources/images/gradient-bg-blue-min.jpeg'
import EastLogo from '../../resources/images/east-logo.svg'
import SignInWallet from './sign-in/SignInWallet'
import { NavigationLeft } from '../../components/Button'
import PasswordRecovery from './password-recovery/PasswordRecovery'
import PasswordReset from './password-reset/PasswordReset'
import ConfirmUser from './confirm-user/ConfirmUser'
import SignInSelectType from './sign-in/SignInSelectType'
import SignInSeed from './sign-in/SignInSeed'

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
  padding-bottom: 64px;
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
  font-family: BrutalType,sans-serif;
  text-align: center;
  letter-spacing: -1px;
  font-weight: 800;
  font-size: 48px;
  color: white;
`

const NavigationContainer = styled.div`
  position: absolute;
  left: 40px;
  top: 332px;

  @media only screen and (max-width: 800px) {
    display: none;
  }
`

const Auth: React.FunctionComponent = () =>  {
  const { route: { name: routeName }, router } = useRoute()
  let content = null
  let title = ''

  const tabsProps = {
    defaultActiveId: routeName === RouteName.SignUp ? RouteSegment.signUp : RouteSegment.signIn,
    activeTabId: routeName === RouteName.SignUp ? RouteSegment.signUp : RouteSegment.signIn,
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
    title = 'Welcome to EAST'
    content = <Block marginTop={40}>
      <Tabs {...tabsProps} />
    </Block>
  } else if(routeName === RouteName.SignInSelectType) {
    title = 'Login'
    content = <div>
      <NavigationContainer><NavigationLeft onClick={() => router.navigate(RouteName.SignIn)} /></NavigationContainer>
      <SignInSelectType />
    </div>
  } else if(routeName === RouteName.SignInSeed) {
    title = 'Login with SEED phrase'
    content = <div>
      <NavigationContainer>
        <NavigationLeft onClick={() => router.navigate(RouteName.SignIn)} />
      </NavigationContainer>
      <SignInSeed />
    </div>
  } else if(routeName === RouteName.SignInWallet) {
    title = 'Login with WE Wallet'
    content = <div>
      <NavigationContainer><NavigationLeft onClick={() => router.navigate(RouteName.SignIn)} /></NavigationContainer>
      <SignInWallet />
    </div>
  } else if(routeName === RouteName.PasswordRecovery) {
    title = 'Password recovery'
    // content = <PasswordRecovery />
    content = <div>
      <NavigationContainer>
        <NavigationLeft onClick={() => {
          router.navigate(RouteName.SignIn)
        }} />
      </NavigationContainer>
      <PasswordRecovery />
    </div>
  } else if(routeName === RouteName.PasswordReset) {
    title = 'Reset password'
    content = <PasswordReset />
  } else if(routeName === RouteName.ConfirmUser) {
    title = 'User confirmation'
    content = <ConfirmUser />
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
