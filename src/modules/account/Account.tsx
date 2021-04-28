import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { AccountCard } from './Card'
import { AccountMenu, MenuOption } from './Menu'
import EastLogo from '../../resources/images/east-logo.svg'
import { FAQ } from './modals/FAQ'
import { Settings } from './modals/Settings'
import { Batches } from './modals/batches/Batches'
import { TransferEast } from './modals/TransferEast'
import { BuyEast } from './modals/buy-east/BuyEast'
import { Route, useRoute } from 'react-router5'
import { RouteName } from '../../router/segments'

const Container = styled.div`

`

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 159px;
`

const MenuContainer = styled.div`
  @keyframes fadeInControls {
    from {
      transform: translateY(150%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1
    }
  }

  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  animation: fadeInControls 1000ms ease forwards;
`

const EastLogoWrapper = styled.div`
  position: absolute;
  bottom: 48px;
  left: 37px;
  width: 174px;
  height: 55px;
  background-image: url(${EastLogo});
  //opacity: 0.6;
`

const ChartContainer = styled.div`
  position: absolute;
  top: 0;
`

const AccountContent = styled.div<{visible: boolean}>`
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 250ms;
`

const PrimaryModalContainer = styled.div``

const getPrimaryModalByRoute = () => {
  const { route: { name }, router } = useRoute()

  const onCloseModal = () => {
    router.navigate(RouteName.Account)
  }

  if (name.startsWith(RouteName.BuyEast)) {
    return <BuyEast onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.Batches)) {
    return <Batches onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.TransferEast)) {
    return <TransferEast onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.AccountSettings)) {
    return <Settings onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.Faq)) {
    return <FAQ onClose={onCloseModal} />
  }

  return null
}

const Account = observer( () => {
  const { authStore, configStore: { configLoaded } } = useStores()

  const primaryModal = getPrimaryModalByRoute()

  return <Container>
    {primaryModal &&
      <PrimaryModalContainer>
        {primaryModal}
      </PrimaryModalContainer>
    }
    <AccountContent visible={!primaryModal}>
      <ChartContainer>
        {/*<WestChart />*/}
      </ChartContainer>
      <CardContainer>
        <AccountCard />
      </CardContainer>
      <MenuContainer>
        <AccountMenu />
      </MenuContainer>
      <EastLogoWrapper />
    </AccountContent>
  </Container>
})

export default Account
