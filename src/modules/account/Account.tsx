import React from 'react'
import styled from 'styled-components'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { AccountCard } from './Card'
import { AccountMenu } from './Menu'
import EastLogo from '../../resources/images/east-logo.svg'

const Container = styled.div`

`

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 159px;
`

const MenuContainer = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
`

const EastLogoWrapper = styled.div`
  position: absolute;
  bottom: 48px;
  left: 37px;
  width: 174px;
  height: 55px;
  background-image: url(${EastLogo});
`

const Account = observer( () => {
  const { authStore, configStore: { configLoaded } } = useStores()

  const cardProps = {
    eastAmount: '132,24',
    westAmount: '320',
    address: '3Nmca7xgmoGbW2GPzbSzKDxmchrLFbvKByg',
    onClick: () => { console.log('clicked') }
  }

  return <Container>
    <EastLogoWrapper />
    <CardContainer>
      <AccountCard {...cardProps} />
    </CardContainer>
    <MenuContainer>
      <AccountMenu />
    </MenuContainer>
  </Container>
})

export default Account
