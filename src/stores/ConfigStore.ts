import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { WestDecimals } from '../constants'
import { EastOpType } from '../interfaces'

export default class ConfigStore {
  api

  config = {
    eastContractId: '',
    clientAddress: ''
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
    usdpPart: 0.5,
    westCollateral: 2.5,
    liquidationCollateral: 1.3
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

  getClientAddress () {
    return this.config.clientAddress || ''
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

  getLiquidationCollateral () {
    return +this.eastContractConfig['liquidationCollateral'] || 1.3
  }

  // Fee for transactions
  getDockerCallFee () {
    return this.nodeConfig.minimumFee['104']
  }

  getTransferFee () {
    return this.nodeConfig.minimumFee['4']
  }

  getAtomicFee () {
    return this.nodeConfig.minimumFee['120']
  }

  // Fee for UI interfaces
  getFeeByOpType (opType: EastOpType): string {
    const callFee = +this.getDockerCallFee()
    const transferFee = +this.getTransferFee()
    const atomicFee = +this.getAtomicFee()
    const allTxsFee = (transferFee + callFee + atomicFee)
    let resultFee = '0'
    switch(opType) {
    case EastOpType.mint: resultFee = allTxsFee.toString(); break
    case EastOpType.supply: resultFee = (allTxsFee + callFee).toString(); break
    case EastOpType.transfer: resultFee = callFee.toString(); break
    case EastOpType.close_init: resultFee = callFee.toString(); break
    }
    return new BigNumber(resultFee).dividedBy(Math.pow(10, WestDecimals)).toString()
  }
}
