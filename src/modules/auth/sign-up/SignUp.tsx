import React, { useState } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Link, useRoute } from 'react-router5'
import { Block, Block24, Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input } from '../../../components/Input'
import { Button } from '../../../components/Button'

type IProps = WithTranslation

const Container = styled.div`
  width: 376px;
`

const SignUp = (props: IProps) => {
  const { t } = props
  const { api, authStore } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const onChangeLogin = (e: any) => {
    console.log('onChangeLogin', e.target.value)
  }

  const onChangePassword = (e: any) => {
    console.log('onChangePassword', e.target.value)
  }

  const onChangeConfirm = (e: any) => {
    console.log('onChangeConfirm', e.target.value)
  }

  return <Container>
    <Input placeholder={t('auth.login')} onChange={onChangeLogin} />
    <Block24 />
    <Input placeholder={t('auth.password')} type={'password'} onChange={onChangePassword} />
    <Block24 />
    <Input placeholder={t('auth.confirm_password')} type={'password'} onChange={onChangeConfirm} />
    <Block marginTop={54} />
    <Button type={'primary'}>{t('auth.enter')}</Button>
  </Container>
}

export default withTranslation()(SignUp)
