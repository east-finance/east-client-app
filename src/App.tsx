import React, { FunctionComponent } from 'react'
import { Provider } from 'mobx-react'
import { RouterProvider } from 'react-router5'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from 'styled-components'
import { router } from './router'
import { initI18n } from './i18n'
import AuthStore from './stores/AuthStore'
import ConfigStore from './stores/ConfigStore'
import DataStore from './stores/DataStore'
import Content from './Content'
import theme from './components/theme'
import StyleGlobal from './resources/styles/styles-global'
import { Api } from './api'

const configStore = new ConfigStore()
const api = new Api()
const authStore = new AuthStore(router, api)
const dataStore = new DataStore(api)

const stores = {
  api,
  authStore,
  configStore,
  dataStore
}

initI18n()

const App: FunctionComponent = () => {
  return (
    <RouterProvider router={router}>
      <I18nextProvider i18n={i18next}>
        <Provider {...stores}>
          <ThemeProvider theme={theme}>
            <StyleGlobal />
            <Content />
          </ThemeProvider>
        </Provider>
      </I18nextProvider>
    </RouterProvider>
  )
}

export default App
