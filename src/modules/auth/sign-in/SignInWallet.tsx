import React, { useEffect, useState } from 'react'
import { useRoute } from 'react-router5'
import { Block, Block16, Block24 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Button } from '../../../components/Button'
import { observer } from 'mobx-react'
import { RouteName } from '../../../router/segments'
import { BigNumber } from 'bignumber.js'
import { WestDecimals } from '../../../constants'
import { config } from '@wavesenterprise/js-sdk'

const Container = styled.div`
  width: 640px;
  margin: 0 auto;
`

const Description = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
`

const PrimaryDescription = styled(Description)`
  font-size: 20px;
`

const ButtonContainer = styled.div`
  width: 376px;
  margin: 0 auto;
`

const WalletInfoContainer = styled.div`
  text-align: center;
`

const SelectedAddressContainer = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: inline-flex;
  flex-direction: column;
`

const SelectedAddress = styled.div`
  font-size: 20px;
  line-height: 16px;
  color: #FFFFFF;
  text-align: left;
`

const SelectedAddressInfo = styled.div`
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  color: #FFFFFF;
  opacity: 0.6;
`

const AddressBalance = styled(SelectedAddress)`
  opacity: 0.5;
`

const SignInWallet = observer(() => {
  const { api, authStore, dataStore, configStore } = useStores()
  const { router } = useRoute()

  const [noAccounts, setNoAccounts] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [addressBalance, setAddressBalance] = useState('0')

  const onUseAddressClicked = async () => {
    try {
      await configStore.loadEastContractConfig()
      await configStore.loadNodeConfig()
    } catch (e) {
      console.error('Cannot get remote configs', e.message)
    }
    authStore.setSelectedAddress(selectedAddress)
    dataStore.startPolling(selectedAddress)
    router.navigate(RouteName.Account)
    authStore.setLoggedIn(true)
  }

  useEffect(() => {
    const checkWallet = async () => {
      try {
        const state = await window.WEWallet.publicState()
        console.log('Wallet state:', state)
        if (state.account) {
          const { address, balance } = state.account
          setSelectedAddress(address)
          const balanceFormatted = new BigNumber(balance.available).dividedBy(Math.pow(10, WestDecimals)).toString()
          setAddressBalance(balanceFormatted)
        }
      } catch (e) {
        console.log('Wallet auth error:', e)
        if (e && e.code === '14') {
          setNoAccounts(true)
        }
      }
    }
    let intervalId: any
    if (window.WEWallet) {
      checkWallet()
      intervalId = setInterval(checkWallet, 5000)
    }

    return function cleanup () {
      clearInterval(intervalId)
    }
  }, [])

  let content = null

  if (window.WEWallet) {
    if (selectedAddress) {
      content = <WalletInfoContainer>
        <Block marginTop={48}>
          <Description>Confirm the address</Description>
        </Block>
        <Block marginTop={95} style={{ textAlign: 'center' }}>
          <SelectedAddressContainer>
            <SelectedAddress>{selectedAddress}</SelectedAddress>
            <Block16>
              <AddressBalance>{addressBalance} WEST</AddressBalance>
            </Block16>
          </SelectedAddressContainer>
        </Block>
        <Block marginTop={64}>
          <ButtonContainer>
            <Button type={'primary'} onClick={onUseAddressClicked}>Continue with this address</Button>
          </ButtonContainer>
        </Block>
        <Block24>
          <SelectedAddressInfo>To change the address, choose another one in WE Wallet</SelectedAddressInfo>
        </Block24>
      </WalletInfoContainer>
    } else if (noAccounts) {
      content = <Block marginTop={98}>
        <Description>Add new account in Waves Enterprise Wallet</Description>
      </Block>
    } else {
      content = <Block marginTop={98}>
        <Description>Unknown error</Description>
      </Block>
    }
  } else {
    content = <div>
      <Block marginTop={98} />
      <PrimaryDescription>We can’t find WE Wallet extension</PrimaryDescription>
      <Block marginTop={40} />
      <Description>
        To use existing address from Waves Enterprise blockchain, you need to install Waves Enterprise Wallet extension from Google Chrome Web Store
      </Description>
      <Block marginTop={64} />
      <ButtonContainer>
        <Button>Go to Chrome Web Store</Button>
      </ButtonContainer>
    </div>
  }

  return <Container>
    {content}
  </Container>
})

export default SignInWallet
