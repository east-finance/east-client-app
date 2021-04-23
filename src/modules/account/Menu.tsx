import React from 'react'
import styled from 'styled-components'
import CardBackground from '../../resources/images/card_bg.png'
import { Block } from '../../components/Block'
import iconPlus from '../../resources/images/icon-plus.png'
import iconHelm from '../../resources/images/icon-helm.png'
import iconExchange from '../../resources/images/icon-exchange.png'
import iconExport from '../../resources/images/icon-export.png'
import iconSettings from '../../resources/images/icon-settings.png'
import iconQuestion from '../../resources/images/icon-question.png'

interface CardProps {
  eastAmount: string;
  westAmount: string;
  address: string;
  onClick: () => void;
}

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
  
  &:not(:first-child) {
    margin-left: 45px;
  }
  
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
const IconHelm = styled(IconCommon)`background-image: url(${iconHelm});`
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

interface IProps {
  onClick: (menuOption: MenuOption) => void
}

export const AccountMenu = (props: IProps) => {
  return <Container>
    <MenuItem onClick={() => props.onClick(MenuOption.buy)}>
      <IconPlus />
    </MenuItem>
    <MenuItem onClick={() => props.onClick(MenuOption.batches)}>
      <IconHelm />
    </MenuItem>
    <MenuItem onClick={() => props.onClick(MenuOption.exchange)}>
      <IconExchange />
    </MenuItem>
    <MenuItem onClick={() => props.onClick(MenuOption.transfer)}>
      <IconExport />
    </MenuItem>
    <MenuItem onClick={() => props.onClick(MenuOption.settings)}>
      <IconSettings />
    </MenuItem>
    <MenuItem onClick={() => props.onClick(MenuOption.faq)}>
      <IconQuestion />
    </MenuItem>
  </Container>
}
