import { makeAutoObservable } from 'mobx'
import axios from 'axios'

export default class ConfigStore {
  configLoaded = false

  config = {
    eastContractId: '',
    eastOwnerAddress: ''
  }

  constructor() {
    makeAutoObservable(this)
    this.loadConfig()
  }

  async loadConfig () {
    try {
      const start = Date.now()
      const { data } = await axios.get('/app.config.json')
      console.log('app.config.json loaded:', data, ', time elapsed:', Date.now() - start, 'ms')
      this.setConfig(data)
    } catch (e) {
      console.log('Cannot get app config', e.message)
    }
  }

  setConfig (config: any) {
    this.config = {
      ...config
    }
  }

  getEastOwnerAddress () {
    return this.config.eastOwnerAddress || ''
  }

  getEastContractId () {
    return this.config.eastContractId || ''
  }
}
