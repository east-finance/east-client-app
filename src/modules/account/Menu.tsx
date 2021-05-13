import React from 'react'
import styled from 'styled-components'
import iconPlus from '../../resources/images/icon-plus.png'
import iconSafe from '../../resources/images/icon-safe.png'
import iconExchange from '../../resources/images/icon-exchange.png'
import iconExport from '../../resources/images/icon-export.png'
import iconSettings from '../../resources/images/icon-settings.png'
import iconQuestion from '../../resources/images/icon-question.png'
import { RouteName } from '../../router/segments'
import { useRoute } from 'react-router5'

const Container = styled.div`
  display: inline-flex;
  height: 112px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 54px;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
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
    margin-left: 45px;
  }

  &:hover ${Tooltip} {
    display: block;
  }
`

const MenuItem = styled.div`
  background: #FFFFFF;
  opacity: 0.9;
  border-radius: 112px;
  width: 74px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.25s;
  
  &:hover {
    transform: scale(1.1);
  }
`

const IconCommon = styled.div`
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 32px;
`

const IconPlus = styled(IconCommon)`background-image: url(${iconPlus});`
const IconSafe = styled(IconCommon)`background-image: url(${iconSafe});`
const IconExchange = styled(IconCommon)`background-image: url(${iconExchange});`
const IconExport = styled(IconCommon)`background-image: url(${iconExport});`
const IconSettings = styled(IconCommon)`background-image: url(${iconSettings});`
const IconQuestion = styled(IconCommon)`background-image: url(${iconQuestion});`

export enum MenuOption {
  buy = 'buy',
  batches = 'batches',
  exchange = 'exchange',
  transfer = 'transfer',
  settings = 'settings',
  faq = 'faq',
}

export const AccountMenu = () => {
  const { router } = useRoute()
  return <Container>
    <MenuItemContainer>
      <Tooltip>Buy EAST</Tooltip>
      <MenuItem onClick={() => router.navigate(RouteName.BuyEast)}>
        <IconPlus />
      </MenuItem>
    </MenuItemContainer>
    <MenuItemContainer>
      <Tooltip>Batches</Tooltip>
      <MenuItem onClick={() => router.navigate(RouteName.Batches)}>
        <IconSafe />
      </MenuItem>
    </MenuItemContainer>
    <MenuItemContainer>
      <Tooltip>Transfer</Tooltip>
      <MenuItem onClick={() => router.navigate(RouteName.TransferEast)}>
        <IconExport />
      </MenuItem>
    </MenuItemContainer>
    <MenuItemContainer>
      <Tooltip>Settings</Tooltip>
      <MenuItem onClick={() => router.navigate(RouteName.AccountSettings)}>
        <IconSettings />
      </MenuItem>
    </MenuItemContainer>
    <MenuItemContainer>
      <Tooltip>FAQ</Tooltip>
      <MenuItem onClick={() => router.navigate(RouteName.Faq)}>
        <IconQuestion />
      </MenuItem>
    </MenuItemContainer>
  </Container>
}
