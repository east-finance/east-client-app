import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import { Api } from '../api'
import { BigNumber } from 'bignumber.js'
import { WestDecimals } from '../constants'
import { EastOpType } from '../interfaces'
import { AuthCustomError } from '../modules/auth/utils'
import { roundNumber } from '../utils'

export default class ConfigStore {
  api

  config = {
    eastContractId: '',
    eastContractVersion: 1,
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
    serviceAddress: '',
    rwaPart: 0,
    westCollateral: 2.5,
    liquidationCollateral: 1.3
  }

  constructor(api: Api) {
    makeAutoObservable(this)
    this.api = api
    this.loadInitialConfig()
  }

  initMetrics (heapMetricsId: string, yandexMetricsId: string) {
    if (heapMetricsId && window.heap) {
      window.heap.load(heapMetricsId)
      console.log(`Heap metrics initialized with id = ${heapMetricsId}`)
    }
    if (yandexMetricsId && window.ym) {
      window.ym(yandexMetricsId, 'init', {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      })
      console.log(`Yandex metrics initialized with id = ${yandexMetricsId}`)
    }
  }

  async loadInitialConfig () {
    try {
      const start = Date.now()
      const { data } = await axios.get(`/app.config.json?t=${Date.now()}`)
      console.log('app.config.json loaded:', data, ', time elapsed:', Date.now() - start, 'ms')
      let eastContractVersion = this.config.eastContractVersion
      if (data && data.eastContractVersion) {
        eastContractVersion = Number(data.eastContractVersion)
      }
      this.config = {
        ...data,
        eastContractVersion
      }
      if(data) {
        this.initMetrics(data.heapMetricsId, data.yandexMetricsId)
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
    try {
      const eastContractId = this.getEastContractId()
      const [{ value }] = await this.api.getContractState(this.getEastContractId(), 'config')
      const remoteConfig = JSON.parse(value)
      console.log(`East Contract (id: "${eastContractId}") config:`, remoteConfig)
      this.eastContractConfig = {
        ...this.eastContractConfig,
        ...remoteConfig
      }
      return { ...this.eastContractConfig }
    } catch (e) {
      console.error(`Error on load East contract config(contractId: ${this.getEastContractId()}):`, e.message)
      throw new AuthCustomError('Cannot load EAST contract config')
    }
  }

  getEastContractId () {
    return this.config.eastContractId || ''
  }

  getEastContractVersion () {
    return this.config.eastContractVersion || 1
  }

  getClientAddress () {
    return this.config.clientAddress || ''
  }

  getEastServiceAddress () {
    return this.eastContractConfig.serviceAddress || ''
  }

  getOracleContractId () {
    return this.eastContractConfig.oracleContractId || ''
  }

  getRwaPart () {
    return this.eastContractConfig['rwaPart'] || 0
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

  // Additional claim_overpay_init fee
  // Hardcoded in EAST-contract
  getClaimOverpayFee () {
    return 0.2
  }

  // Additional close_init fee
  // Hardcoded in EAST-contract and EAST-service
  getCloseAdditionalFee () {
    return 0.2
  }

  getCloseTotalFee () {
    return roundNumber(+this.getFeeByOpType(EastOpType.close_init) + this.getCloseAdditionalFee())
  }

  // Fee for UI interfaces
  getFeeByOpType (opType: EastOpType): string {
    const callFee = +this.getDockerCallFee()
    const transferFee = +this.getTransferFee()
    const atomicFee = +this.getAtomicFee()
    const atomicSumFee = (transferFee + callFee + atomicFee)
    let resultFee = '0'
    switch(opType) {
    case EastOpType.mint: resultFee = atomicSumFee.toString(); break
    case EastOpType.supply: resultFee = (atomicSumFee).toString(); break
    case EastOpType.reissue: resultFee = (transferFee + callFee + callFee + atomicFee).toString(); break
    case EastOpType.transfer: resultFee = callFee.toString(); break
    case EastOpType.close_init: resultFee = callFee.toString(); break
    }
    return new BigNumber(resultFee).dividedBy(Math.pow(10, WestDecimals)).toString()
  }
}
