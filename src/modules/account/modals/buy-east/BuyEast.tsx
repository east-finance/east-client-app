import React, { useEffect, useState } from 'react'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { ModalStatus, PrimaryModal } from '../../Modal'
import { CheckForm } from './CheckForm'
import { Steps } from './constants'
import { FillForm, FillFormData } from './FillForm'
import useStores from '../../../../hooks/useStores'
import { RechargeWest } from './RechargeWest'
import { BuyWestSuccess } from './Success'

interface IProps {
  onClose: () => void
}

export const BuyEast = (props: IProps) => {
  const { configStore, dataStore, authStore } = useStores()
  const [currentStep, setCurrentStep] = useState(Steps.fill)
  const [eastAmount, setEastAmount] = useState('')
  const [westAmount, setWestAmount] = useState('')
  const [westBalance, setWestBalance] = useState('0')

  const [westRate, setWestRate] = useState(dataStore.westRate)
  const [usdapRate, setUsdapRate] = useState(dataStore.usdapRate)
  const [inProgress, setInProgress] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const { westRate, usdapRate } = await dataStore.getTokenRates()
        setWestRate(westRate)
        setUsdapRate(usdapRate)
      } catch (e) {
        console.error('Cannot get oracle data', e.message)
      }
    }
    getData()
  }, [])

  const sendAtomic = async () => {
    const state = await window.WEWallet.publicState()
    const { account: { address, publicKey } } = state
    const ownerAddress = configStore.getEastOwnerAddress()
    const eastContractId = configStore.getEastContractId()
    console.log('ownerAddress', ownerAddress)
    console.log('eastContractId', eastContractId)
    const transfer = {
      type: 'transferV3',
      tx: {
        recipient: ownerAddress,
        assetId: 'WAVES',
        amount: +westAmount * Math.pow(10, 8),
        fee: configStore.getTransferFee(),
        attachment: '',
        timestamp: Date.now(),
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transferId = await window.WEWallet.getTxId('transferV3', transfer.tx)
    const dockerCall = {
      type: 'dockerCallV4',
      tx: {
        senderPublicKey: publicKey,
        authorPublicKey: publicKey,
        contractId: eastContractId,
        contractVersion: 1,
        timestamp: Date.now(),
        params: [{
          type: 'string',
          key: 'mint',
          value: JSON.stringify({
            transferId: transferId
          })
        }],
        fee: configStore.getDockerCallFee(),
        atomicBadge: {
          trustedSender: address
        }
      }
    }
    const transactions = [transfer, dockerCall]
    // const signedTx = await window.WEWallet.signAtomicTransaction({ transactions, fee: '0' })
    // console.log('signedTx', signedTx)
    const result = await window.WEWallet.broadcastAtomic(transactions, configStore.getAtomicFee())
    console.log('Broadcast atomic result', result)
  }

  let content = null
  let modalStatus = ModalStatus.success
  const formProps = {
    eastAmount,
    westAmount,
    westRate,
    usdapRate,
    inProgress
  }
  if (currentStep === Steps.fill) {
    // const onNextClicked = (data: FillFormData) => {
    //   setEastAmount(data.eastAmount)
    //   setWestAmount(data.westAmount)
    //   setCurrentStep(Steps.check)
    // }
    const onNextClicked = async (data: FillFormData) => {
      try {
        setInProgress(true)
        setEastAmount(data.eastAmount)
        setWestAmount(data.westAmount)
        const westBalance = await dataStore.getWestBalance(authStore.address)
        setWestBalance(westBalance)
        if (+data.westAmount > +westBalance) {
          setCurrentStep(Steps.rechargeWest)
        } else {
          setCurrentStep(Steps.check)
        }
      } catch (e) {
        console.error('sendAtomic Error:', e)
      } finally {
        setInProgress(false)
      }
    }
    content = <FillForm {...formProps} onNextClicked={onNextClicked} />
  } else if (currentStep === Steps.check) {
    // const onNextClicked = () => setCurrentStep(Steps.selectExchange)
    const onNextClicked = async () => {
      try {
        setInProgress(true)
        const westBalance = await dataStore.getWestBalance(authStore.address)
        setWestBalance(westBalance)
        if (+westAmount > +westBalance) {
          setCurrentStep(Steps.rechargeWest)
        } else {
          const state = await window.WEWallet.publicState()
          if (state.locked) {
            await window.WEWallet.auth({ data: 'EAST Client auth' })
          }
          await sendAtomic()
          setCurrentStep(Steps.success)
        }
      } catch (e) {
        console.error('sendAtomic Error:', e)
      } finally {
        setInProgress(false)
      }
    }
    const onPrevClicked = () => setCurrentStep(Steps.fill)
    content = <CheckForm {...formProps} onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} />
  } else if (currentStep === Steps.rechargeWest) {
    const onPrevClicked = () => setCurrentStep(Steps.fill)
    const rechargeWestAmount = (+westAmount - +westBalance).toString()
    content = <RechargeWest rechargeWestAmount={rechargeWestAmount} eastAmount={eastAmount} westAmount={westAmount} onPrevClicked={onPrevClicked} />
    modalStatus = ModalStatus.warning
  } else if (currentStep === Steps.success) {
    content = <BuyWestSuccess onClose={props.onClose} />
  }

  return <PrimaryModal {...props} status={modalStatus}>
    <PrimaryTitle>issue east stablecoin</PrimaryTitle>
    <div>{content}</div>
  </PrimaryModal>
}
