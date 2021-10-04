import React, { useEffect, useState } from 'react'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { GradientText } from '../../components/Text'
import { IWatchTxRequest } from '../../interfaces'
import iconClock from '../../resources/images/clock.png'
import { Icon } from '../../components/Icons'

const fadeIn = keyframes`
  from {
    opacity: 0;
    top: 32px;
  }
  to {
    opacity: 1;
    top: -64px;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    top: -64px;
  }
  to {
    opacity: 0;
    top: 32px;
  }
`

const fadeInMs = 250

const Container = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 32px;
  display: flex;
  width: 100%;
  justify-content: center;
  animation: ${props => props.isVisible ? fadeIn : fadeOut} ${fadeInMs}ms ease forwards;
`

const Notification = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  text-align: center;
  padding: 8px 24px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 24px;
`

const ClockIcon = styled(Icon)`
  margin-left: -8px;
`

const Text = styled(GradientText)`
  background: linear-gradient(90deg, #5352B8 0%, #323177 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  margin-left: 4px;
`

export const TxsProgressBar = observer( () => {
  const { dataStore } = useStores()
  // const tx = dataStore.txRequests[0]

  const [isVisible, setIsVisible] = useState(false)
  const [tx, setTx] = useState<null | IWatchTxRequest>(null)

  useEffect(() => {
    const request = dataStore.txRequests.length > 0 ? dataStore.txRequests[0] : null
    if (request) {
      setTx(request)
      setIsVisible(true)
    } else {
      setIsVisible(false)
      setTimeout(() => setTx(null), fadeInMs)
    }
  }, [dataStore.txRequests])

  return <Container isVisible={isVisible}>
    {tx &&
      <Notification>
        <ClockIcon backgroundImage={iconClock} size={32} />
        <Text>Transaction in progress: EAST {tx.type}</Text>
      </Notification>
    }
  </Container>
})
