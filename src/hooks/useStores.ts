import React from 'react'
import { MobXProviderContext } from 'mobx-react'
import DataStore from '../stores/DataStore'
import AuthStore from '../stores/AuthStore'
import ConfigStore from '../stores/ConfigStore'
import { Api } from '../api'
import SignStore from '../stores/SignStore'

export type AppContext = {
  api: Api;
  dataStore: DataStore;
  authStore: AuthStore;
  configStore: ConfigStore;
  signStore: SignStore;
}

export default () => {
  return React.useContext(MobXProviderContext) as AppContext
}
