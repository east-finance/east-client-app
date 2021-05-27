import React from 'react'
import styled from 'styled-components'
import iconPlus from '../../resources/images/icon-plus.png'
import iconSafe from '../../resources/images/icon-safe.png'
import iconTransfer from '../../resources/images/icon-transfer.png'
import iconSettings from '../../resources/images/icon-settings.png'
import iconQuestion from '../../resources/images/icon-question.png'
import { RouteName } from '../../router/segments'
import { useRoute } from 'react-router5'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'

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

const MenuItem = styled.div<{ disabled?: boolean; }>`
  background: #FFFFFF;
  opacity: 0.9;
  border-radius: 112px;
  width: 74px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.25s;

  ${({ disabled }) => disabled && `
    opacity: 0.2;
  `}

  ${({ disabled }) => !disabled && `
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  `}
`

const IconCommon = styled.div`
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 32px;
`

const IconPlus = styled(IconCommon)`background-image: url(${iconPlus});`
const IconSafe = styled(IconCommon)`background-image: url(${iconSafe});`
const IconTransfer = styled(IconCommon)`background-image: url(${iconTransfer});padding-bottom: 4px;`
const IconSettings = styled(IconCommon)`background-image: url(${iconSettings});`
const IconQuestion = styled(IconCommon)`background-image: url(${iconQuestion});`

export const AccountMenu = observer(() => {
  const { authStore, dataStore } = useStores()
  const isUserHaveEast = parseInt(dataStore.eastBalance) > 0
  const { router } = useRoute()
  const batchesAvailable = isUserHaveEast
  const transferAvailable = isUserHaveEast
  return <Container>
    <MenuItemContainer>
      <Tooltip>Buy EAST</Tooltip>
      <MenuItem onClick={() => router.navigate(RouteName.BuyEast)}>
        <IconPlus />
      </MenuItem>
    </MenuItemContainer>
    <MenuItemContainer>
      {batchesAvailable &&
        <Tooltip>Transactions</Tooltip>
      }
      <MenuItem onClick={() => router.navigate(RouteName.TransactionsHistory)}>
        <IconSafe />
      </MenuItem>
    </MenuItemContainer>
    <MenuItemContainer>
      {transferAvailable &&
        <Tooltip>Transfer</Tooltip>
      }
      <MenuItem disabled={!transferAvailable} onClick={() => transferAvailable && router.navigate(RouteName.TransferEast)}>
        <IconTransfer />
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
})
