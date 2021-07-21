import React, { FunctionComponent } from 'react'
import { observer, Provider } from 'mobx-react'
import { useRoute } from 'react-router5'
import Auth from './modules/auth/Auth'
import Account from './modules/account/Account'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'
import { ToastCloseButton } from './components/Notification'

const ToastWrapper = styled.div`
  position: absolute;
  right: 200px;
  top: 0;
`

const Content: FunctionComponent = observer( () => {
  const { route } = useRoute()
  let content = null
  if (route.name.startsWith('account')) {
    content = <Account />
  } else {
    content = <Auth />
  }

  return <Provider>
    <ToastWrapper id={'toast-container'}>
      <ToastContainer closeButton={ToastCloseButton} />
    </ToastWrapper>
    {content}
  </Provider>
})

export default Content
