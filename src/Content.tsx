import React, { FunctionComponent } from 'react'
import { useRoute } from 'react-router5'
import { observer, Provider } from 'mobx-react'
import { RouteSegment } from './router/segments'
import useStores from './hooks/useStores'
import Auth from './modules/auth/Auth'
import Account from './modules/account/Account'

const Content: FunctionComponent = observer( () => {
  const { route: { name } } = useRoute()
  const { authStore, configStore: { configLoaded } } = useStores()

  let content = null

  if (authStore.isLoggedIn) {
    content = <Account />
  } else {
    content = <Auth />
  }

  return <Provider>
    {content}
  </Provider>
}
)

export default Content
