import React, { useState } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Link, useRoute } from 'react-router5'
import { Block32 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'

type IProps = WithTranslation

const Container = styled.div`
  width: 448px;
`

const SignIn = (props: IProps) => {
  const { t } = props
  const { api, authStore } = useStores()
  const { router } = useRoute()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return <Container>
    <Block32>
      Sign in page, locale: {t('locale')}
    </Block32>
  </Container>
}

export default withTranslation()(SignIn)
