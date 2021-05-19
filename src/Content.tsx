import React, { FunctionComponent, useEffect } from 'react'
import { useRoute } from 'react-router5'
import { observer, Provider } from 'mobx-react'
import useStores from './hooks/useStores'
import Auth from './modules/auth/Auth'
import Account from './modules/account/Account'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'

const ToastWrapper = styled.div`
  position: absolute;
  right: 200px;
  top: 0;
`

const Content: FunctionComponent = observer( () => {
  const { route: { name } } = useRoute()
  const { authStore } = useStores()

  useEffect(() => {
    // // eslint-disable-next-line no-unexpected-multiline
    setTimeout(async () => {
      // const authData = { data: 'Auth on my site' }
      // window.WavesKeeper.auth(authData)
      //   .then((auth: any) => {
      //     console.log(auth) //displaying the result on the console
      //     /*...processing data */
      //   }).catch((error: any) => {
      //     console.error(error) // displaying the result on the console
      //     /*...processing errors */
      //   })
      // const state = await window.WavesKeeper.publicState()
      // console.log('keeper state', state)
      // const { account: { address, publicKey } } = state
      // const transfer = {
      //   type: 'transferV3',
      //   tx: {
      //     recipient: address,
      //     assetId: 'WAVES',
      //     amount: '10000',
      //     fee: '1000000',
      //     attachment: 'Its beautiful!',
      //     timestamp: Date.now(),
      //     atomicBadge: {
      //       trustedSender: address
      //     }
      //   }
      // }
      // const dockerCall = {
      //   type: 'dockerCallV4',
      //   tx: {
      //     senderPublicKey: publicKey,
      //     authorPublicKey: publicKey,
      //     contractId: '4pSJoWsaYvT8iCSAxUYdc7LwznFexnBGPRoUJX7Lw3sh',
      //     contractVersion: 1,
      //     timestamp: Date.now(),
      //     params: [],
      //     fee: '1000000',
      //     atomicBadge: {
      //       trustedSender: address
      //     }
      //   }
      // }
      // const transactions = [transfer, dockerCall]
      // const signedTx = await window.WavesKeeper.signAtomicTransaction({ transactions, fee: '100000' })
      // console.log('signedTx', signedTx)
    }, 1000)
  })

  let content = null

  if (authStore.isLoggedIn) {
    content = <Account />
  } else {
    content = <Auth />
  }

  return <Provider>
    <ToastWrapper id={'toast-container'}>
      <ToastContainer />
    </ToastWrapper>
    {content}
  </Provider>
})

export default Content
