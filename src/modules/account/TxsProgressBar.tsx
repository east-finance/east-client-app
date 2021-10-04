import React, { useEffect, useState } from 'react'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { GradientText } from '../../components/Text'
import { IWatchTxRequest } from '../../interfaces'

const fadeIn = keyframes`
  from {
    opacity: 0;
    top: 32px;
  }
  to {
    opacity: 1;
    top: -72px;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    top: -72px;
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
  box-sizing: border-box;
  width: 317px;
  text-align: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 24px;
`

const Text = styled(GradientText)`
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
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
        <Text>Transaction in progress: EAST {tx.type}</Text>
      </Notification>
    }
  </Container>
})
