import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { AccountCard } from './Card'
import { AccountMenu } from './Menu'
import EastLogo from '../../resources/images/east-logo.svg'
import { FAQ } from './modals/FAQ'
import { Settings } from './modals/Settings'
import { Batches } from './modals/batches/Batches'
import { TransferEast } from './modals/TransferEast'
import { BuyEast } from './modals/buy-east/BuyEast'
import { useRoute } from 'react-router5'
import { RouteName } from '../../router/segments'
import useOutsideAlerter from '../../hooks/useOutsideHandler'
import { fadeIn, fadeInControls, fadeOut } from '../../components/Animations'
import { BackgroundVideo } from '../../components/BackgroundVideo'
import { WestChart } from './WestChart'

const Container = styled.div``

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
  // animation: ${fadeInControls} 1000ms ease forwards;
`

const EastLogoContainer = styled.div`
  position: absolute;
  bottom: 48px;
  left: 37px;
`

const EastLogoWrapper = styled.div`
  width: 174px;
  height: 55px;
  background-image: url(${EastLogo});
  opacity: 0.6;
  z-index: -1;
`

const ChartContainer = styled.div`
  position: absolute;
  top: 0;
`

const AccountContent = styled.div<{isVisible: boolean}>`
  > div {
    animation: ${props => props.isVisible ? fadeIn : fadeOut} 250ms ease forwards;
  }
`

const PrimaryModalContainer = styled.div`
  display: block;
  position: fixed;
  z-index: 9999;
  width: 625px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

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
  const { router } = useRoute()
  const { api, authStore, dataStore, configStore: { configLoaded } } = useStores()

  const primaryModal = getPrimaryModalByRoute()

  const modalRef = useRef(null)
  const onClickOutside = () => {
    router.navigate(RouteName.Account)
  }
  useOutsideAlerter(modalRef, onClickOutside)

  return <Container>
    <BackgroundVideo isBlurred={!!primaryModal} />
    {primaryModal &&
      <PrimaryModalContainer ref={modalRef}>
        {primaryModal}
      </PrimaryModalContainer>
    }
    <AccountContent isVisible={!primaryModal}>
      <ChartContainer>
        <WestChart />
      </ChartContainer>
      <CardContainer>
        <AccountCard />
      </CardContainer>
      <MenuContainer>
        <AccountMenu />
      </MenuContainer>
      <EastLogoContainer>
        <EastLogoWrapper />
      </EastLogoContainer>
    </AccountContent>
  </Container>
})

export default Account
