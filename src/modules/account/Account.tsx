import React from 'react'
import styled from 'styled-components'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { AccountCard } from './Card'

const Container = styled.div`

`

const CardContainer = styled.div`
  
`

const Account = observer( () => {
  const { authStore, configStore: { configLoaded } } = useStores()

  const cardProps = {
    value: '132,24',
    address: '3Nmca7xgmoGbW2GPzbSzKDxmchrLFbvKByg',
    onClick: () => { console.log('clicked') }
  }

  return <Container>
    <CardContainer>
      <AccountCard {...cardProps} />
    </CardContainer>
  </Container>
})

export default withTranslation()(Account)
