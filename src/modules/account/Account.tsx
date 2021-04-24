import React, { useState } from 'react'
import styled from 'styled-components'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { AccountCard } from './Card'
import { AccountMenu, MenuOption } from './Menu'
import EastLogo from '../../resources/images/east-logo.svg'
import { FAQ } from './modals/FAQ'
import { Settings } from './modals/Settings'
import { Batches } from './modals/Batches'

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

const PrimaryModalContainer = styled.div`

`

const Account = observer( () => {
  const { authStore, configStore: { configLoaded } } = useStores()

  const onCloseModal = () => {
    setPrimaryModal(null)
  }

  const [primaryModal, setPrimaryModal] = useState<React.ReactChild | null>(<Batches onClose={onCloseModal} />)

  const cardProps = {
    eastAmount: '132,24',
    westAmount: '320',
    address: '3Nmca7xgmoGbW2GPzbSzKDxmchrLFbvKByg',
    onClick: () => { console.log('clicked') }
  }

  const onMenuClick = (menuOption: MenuOption) => {
    switch(menuOption) {
    case MenuOption.batches: setPrimaryModal(<Batches onClose={onCloseModal} />); break
    case MenuOption.settings: setPrimaryModal(<Settings onClose={onCloseModal} />); break
    case MenuOption.faq: setPrimaryModal(<FAQ onClose={onCloseModal} />); break
    }
  }

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
        <AccountCard {...cardProps} />
      </CardContainer>
      <MenuContainer>
        <AccountMenu onClick={onMenuClick} />
      </MenuContainer>
      <EastLogoWrapper />
    </AccountContent>
  </Container>
})

export default Account
