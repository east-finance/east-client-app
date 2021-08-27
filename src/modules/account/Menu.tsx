import React from 'react'
import styled from 'styled-components'
import { isDesktop } from 'react-device-detect'
import iconPlus from '../../resources/images/icon-plus.png'
import iconLock from '../../resources/images/icon-lock.png'
import iconTime from '../../resources/images/icon-time.png'
import iconExport from '../../resources/images/icon-export.png'
import iconSettings from '../../resources/images/icon-settings.png'
import iconQuestion from '../../resources/images/icon-question.png'
import iconCloseRed from '../../resources/images/icon-close-red.png'
import { RouteName } from '../../router/segments'
import { useRoute } from 'react-router5'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'

const Container = styled.div`
  display: inline-flex;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 54px;
  justify-content: space-between;
  align-items: center;
  padding: min(24px, 3vw);
  
  @media (orientation: landscape)
  and (min-device-width: 375px) 
  and (max-device-width: 812px){
    padding: 1vw;
  }
  
  // tablet
  @media screen and (min-width:768px) and (max-width:1024px) and (orientation:landscape) {
    padding: 1vw;
  }
`

const Tooltip = styled.div`
  display: none;
  position: absolute;
  padding: 2px 0;
  background: white;
  border-radius: 4px;
  margin: auto;
  top: -70px;
  left: 0;
  right: 0;
  
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: #FFFFFF transparent transparent transparent;
    bottom: -16px;
    left: calc(50% - 8px);
  }
`

const MenuItemContainer = styled.div`
  position: relative;
  &:not(:first-child) {
    margin-left: min(45px, 3vw);
  }

  &:hover ${Tooltip} {
    display: block;
  }
`

const MenuItem = styled.div<{ disabled?: boolean; }>`
  background: #FFFFFF;
  opacity: 0.9;
  border-radius: 112px;
  width: min(74px, 10vw);
  height: min(64px, 8.64vw);
  background-repeat: no-repeat;
  background-size: 40%;
  background-position: center;
  transition: transform 150ms;

  ${({ disabled }) => disabled && `
    opacity: 0.2;
    pointer-events: none;
  `}

  ${({ disabled }) => !disabled && `
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  `}
  
  @media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 812px) {
    background-size: 50%;
  }
  
  // phone
  @media only screen (orientation: landscape)
  and (min-device-width: 375px) 
  and (max-device-width: 812px) {
    width: 5vw;
    height: 4.32vw;
  }
  
  // tablet
  @media screen and (min-width:768px) and (max-width:1024px) and (orientation:landscape) {
    width: 5vw;
    height: 4.32vw;
  }
`

const MenuItemPlus = styled(MenuItem)`background-image: url(${iconPlus});`
const MenuItemLock = styled(MenuItem)`background-image: url(${iconLock});`
const MenuItemTime = styled(MenuItem)`background-image: url(${iconTime});`
const MenuItemExport = styled(MenuItem)`background-image: url(${iconExport});`
const MenuItemSettings = styled(MenuItem)`background-image: url(${iconSettings});`
const MenuItemQuestion = styled(MenuItem)`background-image: url(${iconQuestion});`
const MenuItemClose = styled(MenuItem)`background-image: url(${iconCloseRed});`

const Delimiter = styled.div`
  width: 2px;
  height: 48px;
  background: white;
  margin-left: min(40px, 2vw);
  margin-right: -5px;
`

export const AccountMenu = observer(() => {
  const { dataStore } = useStores()
  const { router } = useRoute()
  const isUserHaveEast = +dataStore.eastBalance > 0
  const isUserHaveVault = +dataStore.vault.eastAmount > 0
  const isVaultClosed = (dataStore.vault.id && !dataStore.vault.isActive)
  const vaultProfit = -dataStore.supplyVaultWestDiff
  const isTransferAvailable = isUserHaveEast
  const isVaultLiquidated = isUserHaveVault && +dataStore.vault.westAmount === 0

  const onMenuClicked = (routeName: string) => {
    router.navigate(routeName)
  }

  return <Container>
    <MenuItemContainer>
      {isDesktop && <Tooltip>Issue EAST</Tooltip>}
      <MenuItemPlus
        onClick={() => onMenuClicked((isUserHaveVault && !isVaultLiquidated) ? RouteName.AddEast : RouteName.BuyEast)}
      />
    </MenuItemContainer>
    {dataStore.claimOverpayAmount > 0.1 &&
      <MenuItemContainer>
        {isDesktop && <Tooltip>Take WEST</Tooltip>}
        <MenuItemLock onClick={() => onMenuClicked(RouteName.TakeWest)} />
      </MenuItemContainer>
    }
    {isTransferAvailable &&
      <MenuItemContainer>
        {isDesktop && <Tooltip>Transfer</Tooltip>}
        <MenuItemExport onClick={() => onMenuClicked(RouteName.TransferEast)} />
      </MenuItemContainer>
    }
    {(isUserHaveVault && isDesktop) &&
      <Delimiter />
    }
    {(isUserHaveVault || isUserHaveEast || isVaultClosed) &&
      <MenuItemContainer>
        {isDesktop && <Tooltip>History</Tooltip>}
        <MenuItemTime onClick={() => onMenuClicked(RouteName.TransactionsHistory)} />
      </MenuItemContainer>
    }
    <MenuItemContainer>
      {isDesktop && <Tooltip>Settings</Tooltip>}
      <MenuItemSettings onClick={() => onMenuClicked(RouteName.AccountSettings)} />
    </MenuItemContainer>
    <MenuItemContainer>
      {isDesktop && <Tooltip>FAQ</Tooltip>}
      <MenuItemQuestion onClick={() => onMenuClicked(RouteName.Faq)} />
    </MenuItemContainer>
    {(isUserHaveVault && isDesktop) &&
      <Delimiter />
    }
    {isUserHaveVault &&
      <MenuItemContainer>
        {isDesktop && <Tooltip>Close</Tooltip>}
        <MenuItemClose onClick={() => onMenuClicked(RouteName.CloseVault)} />
      </MenuItemContainer>
    }
  </Container>
})
