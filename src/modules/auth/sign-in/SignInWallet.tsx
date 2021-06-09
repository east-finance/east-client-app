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
import { ButtonSpinner, RelativeContainer } from '../../../components/Spinner'

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

const CenteredContent = styled.div`
  margin-top: 40%;
`

const SignInWallet = observer(() => {
  const { authStore, dataStore, configStore } = useStores()
  const { router } = useRoute()

  const [selectedAddress, setSelectedAddress] = useState('')
  const [addressBalance, setAddressBalance] = useState('0')
  const [inProgress, setInProgress] = useState(false)
  const [walletErrorCode, setWalletErrorCode] = useState(null)

  const onUseAddressClicked = async () => {
    try {
      setInProgress(true)
      await configStore.loadEastContractConfig()
      await configStore.loadNodeConfig()
    } catch (e) {
      console.error('Cannot get remote configs', e.message)
    } finally {
      setInProgress(false)
    }
    authStore.setSelectedAddress(selectedAddress)
    dataStore.startPolling(selectedAddress)
    router.navigate(RouteName.Account)
    authStore.setLoggedIn(true)
  }

  const checkWallet = async () => {
    try {
      setWalletErrorCode(null)
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
      if (e && e.code) {
        setWalletErrorCode(e.code)
      }
      // if (e && e.code === '14') {
      //   setNoAccounts(true)
      // }
    }
  }

  useEffect(() => {
    let intervalId: any
    if (window.WEWallet) {
      checkWallet()
      intervalId = setInterval(() => {
        console.log('walletErrorCode:', walletErrorCode)
        if (!walletErrorCode) {
          checkWallet()
        }
      }, 5000)
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
            <Button type={'primary'} disabled={inProgress} onClick={onUseAddressClicked}>
              <RelativeContainer>
                {inProgress && <ButtonSpinner />}
                Continue with this address
              </RelativeContainer>
            </Button>
          </ButtonContainer>
        </Block>
        <Block24>
          <SelectedAddressInfo>To change the address, choose another one in WE Wallet</SelectedAddressInfo>
        </Block24>
      </WalletInfoContainer>
    } else if (walletErrorCode === '14') {
      content = <CenteredContent>
        <Description>We can’t detect any addresses in your WE Wallet extension</Description>
      </CenteredContent>
    } else if(walletErrorCode === '12' || walletErrorCode === '10') {
      content = <CenteredContent>
        <Description>Request to WE Wallet is rejected by user.</Description>
        <Block16>
          <Description>Allow access in WE Wallet &quot;Permissions control&quot; menu and try again.</Description>
        </Block16>
        <Block24>
          <ButtonContainer>
            <Button onClick={checkWallet}>Try again</Button>
          </ButtonContainer>
        </Block24>
      </CenteredContent>
    } else if(inProgress) {
      content = <CenteredContent>
        <Description>Retrieving data from WE Wallet...</Description>
      </CenteredContent>
    } else {
      content = <CenteredContent>
        <Description>Unknown error</Description>
      </CenteredContent>
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
