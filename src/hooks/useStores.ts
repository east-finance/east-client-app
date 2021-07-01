import React from 'react'
import { MobXProviderContext } from 'mobx-react'
import DataStore from '../stores/DataStore'
import AuthStore from '../stores/AuthStore'
import ConfigStore from '../stores/ConfigStore'
import { Api } from '../api'

export type AppContext = {
  api: Api;
  dataStore: DataStore;
  authStore: AuthStore;
  configStore: ConfigStore;
}

export default () => {
  return React.useContext(MobXProviderContext) as AppContext
}
