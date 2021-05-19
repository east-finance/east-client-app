import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { WestDecimals } from '../constants'

export default class ConfigStore {
  api

  config = {
    eastContractId: '',
  }

  nodeConfig = {
    chainId: 'V',
    minimumFee: {
      4: 10000000,
      104: 10000000,
      120: 0
    }
  }

  eastContractConfig = {
    oracleContractId: '',
    adminAddress: '',
    'usdpPart': 0.5,
    'westCollateral': 2.5,
    'liquidationCollateral': 1.3
  }

  constructor(api: Api) {
    makeAutoObservable(this)
    this.api = api
    this.loadInitialConfig()
  }

  async loadInitialConfig () {
    try {
      const start = Date.now()
      const { data } = await axios.get('/app.config.json')
      console.log('app.config.json loaded:', data, ', time elapsed:', Date.now() - start, 'ms')
      this.config = {
        ...data
      }
    } catch (e) {
      console.error('Cannot get app config:', e.message)
    }
  }

  async loadNodeConfig () {
    const nodeConfig = await this.api.getNodeConfig()
    console.log('Node config:', nodeConfig)
    this.nodeConfig = {
      ...this.nodeConfig,
      minimumFee: {
        ...this.nodeConfig.minimumFee,
        ...nodeConfig.minimumFee
      }
    }
    return { ...this.nodeConfig }
  }

  async loadEastContractConfig () {
    const eastContractId = this.getEastContractId()
    const [{ value }] = await this.api.getContractState(this.getEastContractId(), 'config')
    const remoteConfig = JSON.parse(value)
    console.log(`East Contract (id: "${eastContractId}") config:`, remoteConfig)
    this.eastContractConfig = {
      ...this.eastContractConfig,
      ...remoteConfig
    }
    return { ...this.eastContractConfig }
  }

  getEastContractId () {
    return this.config.eastContractId || ''
  }

  getEastOwnerAddress () {
    return this.eastContractConfig.adminAddress || ''
  }

  getOracleContractId () {
    return this.eastContractConfig.oracleContractId || ''
  }

  getUsdpPart () {
    return this.eastContractConfig['usdpPart'] || 0.5
  }

  getWestCollateral () {
    return this.eastContractConfig['westCollateral'] || 2.5
  }

  getDockerCallFee () {
    const fee = this.nodeConfig.minimumFee['104']
    return new BigNumber(fee).dividedBy(Math.pow(10, WestDecimals)).toString()
  }

  getTransferFee () {
    return this.nodeConfig.minimumFee['4']
  }

  getAtomicFee () {
    return this.nodeConfig.minimumFee['120']
  }
}
