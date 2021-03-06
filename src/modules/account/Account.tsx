import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { AccountCard } from './Card'
import { AccountMenu } from './Menu'
import EastLogo from '../../resources/images/east-logo.svg'
import { FAQ } from './modals/FAQ'
import { Settings } from './modals/Settings'
import { Transfer } from './modals/transfer/Transfer'
import { Mint } from './modals/mint/Mint'
import { useRoute } from 'react-router5'
import { RouteName } from '../../router/segments'
import useOutsideAlerter from '../../hooks/useOutsideHandler'
import { fadeIn, fadeInControls, fadeOut } from '../../components/Animations'
import { WestChart } from './WestChart'
import { TransactionsHistory } from './modals/txs_history/TransactionsHistory'
import { IssueEast } from './modals/issue_east/IssueEast'
import { TakeWest } from './modals/take_west/TakeWest'
import { CloseVault } from './modals/close-vault/CloseVault'
import { DetailedCard } from './DetailedCard'
import useStores from '../../hooks/useStores'
import { SupplyVault } from './modals/supply/SupplyVault'
import { BackgroundVideo } from '../../components/BackgroundVideo'
import { TxsProgressBar } from './TxsProgressBar'
import { ContractExecutionStatus } from '../../interfaces'

const Container = styled.div`
`

const CardsContainer = styled.div`
  position: relative;
  margin-top: 50px;
  width: 100vw;
  height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: pinch-zoom;
  
  @media only screen 
  and (min-device-width: 375px)
  and (max-device-width: 812px) {
    transform: scale(0.9);
    -webkit-tap-highlight-color: transparent;
  }
  
  @media (orientation: landscape)
  and (min-device-width: 375px) 
  and (max-device-width: 812px) {
    transform: scale(0.8);
  }
  
  // tablet
  @media only screen and (min-width:768px) and (max-width:1024px) and (orientation:landscape) {
    transform: scale(0.6);
  }
`

const MenuContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 20px;
  width: 100%;
  text-align: center;
  // animation: ${fadeInControls} 1000ms ease forwards;
  
  // tablet
  @media screen and (min-width:768px) and (max-width:1024px) and (orientation:landscape) {
    bottom: 10px;
  }
`

const EastLogoContainer = styled.div`
  position: absolute;
  bottom: 48px;
  left: 37px;
  z-index: 1;
  pointer-events: none;
  
  @media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 812px) {
    display: none;
  }
`

const EastLogoWrapper = styled.div`
  width: 174px;
  height: 55px;
  background-image: url(${EastLogo});
  opacity: 0.6;
`

const ChartContainer = styled.div`
  position: fixed;
  top: 0;
`

const AccountContent = styled.div<{isVisible: boolean}>`
  > div {
    animation: ${props => props.isVisible ? fadeIn : fadeOut} 250ms ease forwards;
  }
  
  ${({ isVisible }) => !isVisible && `
    pointer-events: none;
  `}
`

const PrimaryModalContainer = styled.div`
  display: block;
  position: absolute;
  z-index: 9999;
  min-width: min(625px, 90vw);
  max-height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media only screen and (max-width: 960px) and (orientation:landscape)  {
    width: 50vw;
  }
  
  @media only screen and (min-width: 384px) and (max-width: 767px) and (orientation:landscape) {
    width: 50vw;
  }
`

const getPrimaryModalByRoute = () => {
  const { dataStore } = useStores()
  const { route: { name }, router } = useRoute()

  const onCloseModal = () => {
    router.navigate(RouteName.Account)
    const segment = name.split('.').pop()
    dataStore.heapTrack(`${segment}_closeCross`)
  }

  if (name.startsWith(RouteName.Mint)) {
    return <Mint onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.IssueEast)) {
    return <IssueEast onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.TakeWest)) {
    return <TakeWest onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.SupplyVault)) {
    return <SupplyVault onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.TransactionsHistory)) {
    return <TransactionsHistory onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.TransferEast)) {
    return <Transfer onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.AccountSettings)) {
    return <Settings onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.Faq)) {
    return <FAQ onClose={onCloseModal} />
  } else if (name.startsWith(RouteName.CloseVault)) {
    return <CloseVault onClose={onCloseModal} />
  }

  return null
}

const AccountCards = observer(() => {
  const { dataStore } = useStores()

  const [isFrontShown, setFrontShown] = useState<null | boolean>(null)
  const isPositiveBalance = +dataStore.vaultEastAmount > 0
  const onClick = (e: any) => {
    // const { childNodes } = e.target
    // if (childNodes) {
    //   if (childNodes.length > 0 && (childNodes[0] && childNodes[0].nodeType === 3)) {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     return false
    //   }
    // }
    if (isPositiveBalance) {
      setFrontShown(isFrontShown === null ? false : !isFrontShown)
    }
  }
  return <CardsContainer>
    <div style={{ position: 'relative' }}>
      <TxsProgressBar />
      <AccountCard isShown={isFrontShown} onClick={onClick} />
      {isPositiveBalance &&
      <DetailedCard isShown={isFrontShown === null ? null : !isFrontShown} onClick={onClick} />
      }
    </div>
  </CardsContainer>
})

const Account = observer( () => {
  const { route: { name }, router } = useRoute()
  const { authStore, api, dataStore } = useStores()

  useEffect(() => {
    const checkPendingTxs = async () => {
      try {
        const statuses = await api.getTransactionsStatuses(authStore.address, 1)
        if (statuses.length > 0 && statuses[0].status === ContractExecutionStatus.pending) {
          const { tx_id, type } = statuses[0]
          dataStore.watchTxStatus(tx_id, type)
        }
      } catch (e) {
        console.error('Cannot get user statuses on mount: ', e.message)
      }
    }

    checkPendingTxs()
  }, [])

  const primaryModal = getPrimaryModalByRoute()

  const modalRef = useRef(null)
  const onClickOutside = () => {
    router.navigate(RouteName.Account)
    const segment = name.split('.').pop()
    dataStore.heapTrack(`${segment}_closeOutside`)
  }
  useOutsideAlerter(modalRef, onClickOutside)

  return <Container id={'root-account'}>
    <BackgroundVideo />
    {primaryModal &&
      <PrimaryModalContainer ref={modalRef}>
        {primaryModal}
      </PrimaryModalContainer>
    }
    <AccountContent isVisible={!primaryModal}>
      <ChartContainer>
        <WestChart />
      </ChartContainer>
      <AccountCards />
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
