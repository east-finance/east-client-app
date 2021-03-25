import React, { FunctionComponent } from 'react'
import { Layout } from '@wavesenterprise/uikit'
import { useRoute } from 'react-router5'
import { observer, Provider } from 'mobx-react'
import { RouteSegment } from './router/segments'
import useStores from './hooks/useStores'
import Auth from './modules/auth/Auth'

const Content: FunctionComponent = observer( () => {
  const { route: { name } } = useRoute()
  const { authStore, configStore: { configLoaded } } = useStores()

  let content = null

  if (authStore.isLoggedIn) {
    content = <div>Inner content</div>
  } else {
    content = <Auth />
  }

  return <Layout>
    <Layout.Content>
      <Provider>
        {content}
      </Provider>
    </Layout.Content>
  </Layout>
}
)

export default Content
