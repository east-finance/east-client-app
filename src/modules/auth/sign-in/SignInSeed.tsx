import React, { useState } from 'react'
import { useRoute } from 'react-router5'
import { Block, Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Button } from '../../../components/Button'
import { observer } from 'mobx-react'
import { RouteName } from '../../../router/segments'
import { InputStatus, TextArea } from '../../../components/Input'
import { ButtonSpinner, RelativeContainer } from '../../../components/Spinner'
import { SignStrategy } from '../../../stores/SignStore'
import { toast } from 'react-toastify'
import { ErrorNotification } from '../../../components/Notification'

const Container = styled.div`
  width: 376px;
  margin: 0 auto;
`

const ButtonContainer = styled.div`
  width: 376px;
  margin: 0 auto;
`

const SignInSeed = observer(() => {
  const { signStore, authStore, dataStore } = useStores()
  const { router } = useRoute()
  const [inProgress, setInProgress] = useState(false)
  const [phrase, setPhrase] = useState('')
  const [status, setStatus] = useState(InputStatus.default)

  const onContinueClicked = async () => {
    try {
      toast.dismiss()
      setStatus(InputStatus.default)
      setInProgress(true)
      const seed = await signStore.weSDK.Seed.fromExistingPhrase(phrase.trim())
      console.log('Seed address:', seed.address)
      signStore.setSignStrategy(SignStrategy.Seed)
      signStore.setSeed(seed)
      authStore.setSelectedAddress(seed.address)
      await dataStore.startPolling(seed.address)
      authStore.setLoggedIn(true)
      router.navigate(RouteName.Account)
    } catch (e) {
      console.error('Sign in with seed error:', e.message)
      let message = ''
      if (e.message && e.message.includes('minimum length')) {
        message = 'Minimum length: 15 characters'
      }
      toast(<ErrorNotification title={'Error'} message={message} />, {
        hideProgressBar: true,
        autoClose: 6000
      })
      setStatus(InputStatus.error)
    } finally {
      setInProgress(false)
    }
  }

  const onPhraseChange = (e: any) => {
    const value = e.target.value
    setPhrase(value)
  }

  return <Container>
    <Block marginTop={146}>
      <TextArea
        status={status}
        rows={5}
        placeholder={'Enter 15 words of your SEED phrase'}
        value={phrase}
        onChange={onPhraseChange }
      />
      <Block32>
        <ButtonContainer>
          <Button type={'primary'} disabled={!phrase || inProgress} onClick={onContinueClicked}>
            <RelativeContainer>
              {inProgress && <ButtonSpinner />}
              Continue
            </RelativeContainer>
          </Button>
        </ButtonContainer>
      </Block32>
    </Block>
  </Container>
})

export default SignInSeed
