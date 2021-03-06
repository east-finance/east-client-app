import React, { ChangeEvent, FocusEvent, useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { Block } from '../../../../components/Block'
import { InputStatus, SimpleInput } from '../../../../components/Input'
import { Button } from '../../../../components/Button'
import useStores from '../../../../hooks/useStores'
import { ITag, Tags } from '../../../../components/Tags'
import { roundNumber } from '../../../../utils'
import { TxSendSuccess } from '../../common/TxSendSuccess'
import { observer } from 'mobx-react'
import { EastOpType } from '../../../../interfaces'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ErrorNotification } from '../../../../components/Notification'
import BigNumber from 'bignumber.js'
import { MaxTokenAmount } from '../../../../constants'
import { TransferConfirmation } from './Confirmation'
import { AddWestToAddress } from '../../common/AddWestToAddress'

interface IProps {
  onClose: () => void
}

const Container = styled.div`
  margin: 0 auto;
  @media screen and (min-width: 900px) {
    width: 464px;
  }
`

enum Steps {
  fill = 'fill',
  confirm = 'confirm',
  refillWest = 'refillWest',
  success = 'success'
}

export const Transfer = observer((props: IProps) => {
  const { configStore, dataStore, signStore } = useStores()

  const totalFee = +configStore.getFeeByOpType(EastOpType.transfer)
  const eastAvailable = dataStore.eastBalance

  const [eastAmount, setEastAmount] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [formErrors, setFormErrors] = useState({ east: '', address: '' })
  const [currentStep, setCurrentStep] = useState(Steps.fill)
  const [inProgress, setInProgress] = useState(false)

  const changeStep = (step: Steps) => {
    setCurrentStep(step)
    dataStore.heapTrack(`${EastOpType.transfer}_changeStep_${step}`)
  }

  let content = null
  const title = 'transfer east'

  useEffect(() => {
    if (formErrors.east || formErrors.address) {
      setFormErrors(validateForm())
    }
  }, [eastAmount, userAddress])

  const validateForm = () => {
    let east = ''
    let address = ''
    if (!eastAmount || +eastAmount === 0) {
      east = 'Enter EAST amount'
    } else if (+eastAmount > +eastAvailable) {
      east = 'Not enought EAST on balance'
    } else if (+eastAmount < 0) {
      east = 'Negative east amount'
    }
    if (!userAddress) {
      address = 'Enter address'
    } else {
      try {
        const addressBytes = signStore.weSDK.tools.base58.decode(userAddress)
        const networkByte = configStore.nodeConfig.chainId.charCodeAt(0)
        if (addressBytes.length === 26) {
          if (addressBytes[1] !== networkByte) {
            address = `Wrong network byte (${String.fromCharCode(addressBytes[1])}, expected: ${String.fromCharCode(networkByte)})`
          }
        } else {
          address = 'Wrong address format'
        }
      } catch (e) {
        address = 'Address is not a base64 sequence'
      }
    }
    return {
      east, address
    }
  }

  const onClickContinue = () => {
    const { east, address } = validateForm()
    setFormErrors({ east, address })
    if (!east && !address) {
      changeStep(Steps.confirm)
    }
    if (address) {
      toast.dismiss()
      toast(<ErrorNotification title={'Invalid address'} message={address} />, {
        hideProgressBar: true,
        delay: 0
      })
    }
  }

  const options = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = roundNumber((+tag.value * +eastAvailable).toString(), 8)
    setEastAmount(amount.toString())
  }

  const onConfirmTransfer = async () => {
    if (totalFee > +dataStore.westBalance) {
      changeStep(Steps.refillWest)
      return
    }
    try {
      setInProgress(true)
      const { publicKey } = await signStore.getPublicData()
      const transferTx = {
        senderPublicKey: publicKey,
        authorPublicKey: publicKey,
        contractId: configStore.getEastContractId(),
        contractVersion: configStore.getEastContractVersion(),
        timestamp: Date.now(),
        params: [{
          type: 'string',
          key: 'transfer',
          value: JSON.stringify({
            to: userAddress,
            amount: new BigNumber(+eastAmount).multipliedBy(Math.pow(10, 8)).toNumber()
          })
        }],
        fee: configStore.getDockerCallFee(),
      }
      const result = await signStore.broadcastDockerCall(transferTx)
      console.log('Broadcast TRANSFER east result:', result)
      changeStep(Steps.success)
    } catch(e) {
      console.error('Broadcast transfer EAST error: ', e.message)
    } finally {
      setInProgress(false)
    }
  }

  if (currentStep === Steps.fill) {
    content = <Container>
      <Block marginTop={'10%'}>
        <SimpleInput
          id={'input-east'}
          type={'number'}
          max={MaxTokenAmount}
          status={formErrors.east ? InputStatus.error : InputStatus.default}
          label={`Enter amount of EAST (${eastAvailable} available)`}
          value={eastAmount}
          maxDecimals={8}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEastAmount(e.target.value)}
          onBlur={(e: FocusEvent<HTMLInputElement>) => setEastAmount(e.target.value)}
        />
        <Block marginTop={8}>
          <Tags data={options} onClick={onSelectOption} />
        </Block>
      </Block>
      <SimpleInput
        id={'input-address'}
        status={formErrors.address ? InputStatus.error : InputStatus.default}
        label={'Enter recipient???s address'}
        value={userAddress}
        onChange={(e:  any) => setUserAddress(e.target.value)}
      />
      <Block marginTop={'15%'}>
        <Button
          style={{ width: '304px', margin: '0 auto' }}
          type={'primary'}
          data-attr={'transferEast-1_continueButton'}
          onClick={onClickContinue}>
          Continue
        </Button>
      </Block>
    </Container>
  } else if(currentStep === Steps.confirm) {
    content = <TransferConfirmation
      inProgress={inProgress}
      totalFee={totalFee}
      eastAmount={eastAmount}
      userAddress={userAddress}
      onPrevClicked={() => changeStep(Steps.fill)}
      onSuccess={onConfirmTransfer}
    />
  } else if(currentStep === Steps.refillWest) {
    content = <AddWestToAddress
      westAmount={configStore.getFeeByOpType(EastOpType.transfer)}
      eastAmount={''}
      onPrevClicked={() => changeStep(Steps.confirm)}
    />
  } else {
    content = <TxSendSuccess
      closeAttr={'transferEast-2_close'}
      text={'EAST will be transferred after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  }

  return <PrimaryModal {...props} id={'transfer-east-modal'}>
    <PrimaryTitle>{title}</PrimaryTitle>
    {content}
  </PrimaryModal>
})
