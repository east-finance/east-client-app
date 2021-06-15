import React, { ChangeEvent, useState } from 'react'
import { PrimaryModal } from '../../Modal'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { Block } from '../../../../components/Block'
import styled from 'styled-components'
import { InputStatus, SimpleInput } from '../../../../components/Input'
import { ITag, Tags } from '../../../../components/Tags'
import { Button } from '../../../../components/Button'
import { ButtonSpinner, RelativeContainer } from '../../../../components/Spinner'
import useStores from '../../../../hooks/useStores'
import { claimOverpay } from '../../../../utils/txFactory'
import { TxSendSuccess } from '../../common/TxSendSuccess'
import { observer } from 'mobx-react'

interface IProps {
  onClose: () => void
}

const Container = styled.div`
  margin: 0 auto;
  width: 440px;
`

const Centered = styled.div`
  width: 304px;
  margin: 0 auto;
`

export const TakeWest = observer((props: IProps) => {
  const { dataStore, configStore } = useStores()
  const [isTxSent, setTxSent] = useState(false)
  const [westAmount, setWestAmount] = useState('')
  const [validationError, setValidationError] = useState('')
  const [inProgress, setInProgress] = useState(false)

  const westProfit = dataStore.calculateVaultWestProfit()

  const validateForm = (value: string) => {
    let error = ''
    if(!value || +value === 0) {
      error = 'Empty value'
    } else if(+value > westProfit) {
      error = 'Not enough WEST to withdraw'
    } else if (+value < 0) {
      error = 'Negative value'
    }
    return error
  }

  const sendClaimOverpay = async () => {
    const state = await window.WEWallet.publicState()
    const { account: { publicKey } } = state
    if (state.locked) {
      await window.WEWallet.auth({ data: 'EAST Client auth' })
    }
    const tx = claimOverpay({
      publicKey: publicKey,
      contractId: configStore.getEastContractId(),
      fee: configStore.getDockerCallFee(),
      amount: +westAmount
    })
    console.log('Claim overpay Docker call tx:', tx)
    const result = await window.WEWallet.broadcast('dockerCallV3', tx)
    console.log('Claim overpay broadcast result:', result)
  }

  const buyOptions = [{text: '25%', value: '0.25' }, { text: '50%', value: '0.5' }, { text: '75%', value: '0.75' }, { text: '100%', value: '1' }]
  const onSelectOption = (tag: ITag) => {
    const amount = +tag.value * westProfit
    setWestAmount(amount.toString())
    const error = validateForm(amount.toString())
    setValidationError(error)
  }

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWestAmount(value)
    const error = validateForm(value)
    setValidationError(error)
  }

  const onWithdrawClicked = async () => {
    const error = validateForm(westAmount)
    setValidationError(error)
    if (!error) {
      try {
        setInProgress(true)
        await sendClaimOverpay()
        // await new Promise(resolve => setTimeout(resolve, 4000))
        setTxSent(true)
      } catch (e) {
        console.error('Error on withdraw:', e.message)
      } finally {
        setInProgress(false)
      }
    }
  }

  let content = null
  if (isTxSent) {
    content = <TxSendSuccess
      text={'WEST will be transfered after the transaction is completed. It may take a few minutes.'}
      onClose={props.onClose}
    />
  } else {
    content = <div>
      <Block marginTop={162}>
        <Container>
          <SimpleInput
            type={'number'}
            status={validationError ? InputStatus.error : InputStatus.default}
            label={`Enter amount of WEST (${westProfit} available)`}
            value={westAmount}
            onChange={onChangeInput}
          />
          <Block marginTop={8}>
            <Tags data={buyOptions} onClick={onSelectOption} />
          </Block>
        </Container>
      </Block>
      <Block marginTop={130}>
        <Centered>
          <Button type={'primary'} disabled={inProgress || !westAmount || !!validationError} onClick={onWithdrawClicked}>
            <RelativeContainer>
              {inProgress && <ButtonSpinner />}
              Withdraw WEST
            </RelativeContainer>
          </Button>
        </Centered>
      </Block>
    </div>
  }

  return <PrimaryModal {...props}>
    <PrimaryTitle>take west out of the vault</PrimaryTitle>
    {content}
  </PrimaryModal>
})
