import React from 'react'
import styled from 'styled-components'
import copy from 'copy-to-clipboard'
import { Block } from '../../../components/Block'
import useStores from '../../../hooks/useStores'
import iconCopy from '../../../resources/images/icon-copy.png'
import { toast } from 'react-toastify'
import { InfoNotification, NotificationType, ToastCloseButton } from '../../../components/Notification'
import { roundNumber } from '../../../utils'

interface IProps {
  westAmount: string;
  eastAmount: string;
}

const IconCommon = styled.div`
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 32px;
`

const IconCopy = styled(IconCommon)`
  background-image: url(${iconCopy});
  cursor: pointer;
`

const Container = styled.div`
  margin: 0 auto;
  font-family: Cairo,sans-serif;
  color: ${props => props.theme.darkBlue};
`

const Amount = styled.span`
  font-weight: bold;
  color: ${props => props.theme.yellow}
`

const Centered = styled.div`text-align: center; width: 376px; margin: 0 auto;`

const Description = styled(Centered)`
  font-size: 15px;
  line-height: 18px;
`

const AddressContainer = styled.div`
  width: 100%;
  padding: 4px 8px;
  background: rgba(4, 53, 105, 0.15);
  border-radius: 8px;
  font-family: Cairo,sans-serif;
  font-weight: bold;
  font-size: 22px;
  line-height: 24px;
  color: #0A0606;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Info = styled.div`
  text-align: center;
  color: rgba(4, 53, 105, 0.5);
  font-size: 15px;
  line-height: 24px;
`

export const AddWestToAddress = (props: IProps) => {
  const { authStore } = useStores()
  const onCopyClicked = () => {
    copy(authStore.address)
    toast(<InfoNotification text={'Copied!'} />, {
      hideProgressBar: true,
      closeButton: <ToastCloseButton type={NotificationType.default} closeToast={() => toast.dismiss()} />
    })
  }
  const westAmount = roundNumber(props.westAmount, 4)
  return <Container>
    <Description>
      Add <Amount>{westAmount} WEST</Amount> to your address to get {props.eastAmount} EAST.
    </Description>
    <Block marginTop={40}>
      <Description>
        Use your address
      </Description>
    </Block>
    <Block marginTop={8}>
      <AddressContainer>
        <div>{authStore.address}</div>
        <div><IconCopy onClick={onCopyClicked} /></div>
      </AddressContainer>
    </Block>
    <Block marginTop={40}>
      <Centered>
        <Info>
          Transfers between different blockchains sometimes take up to a couple of hours
        </Info>
      </Centered>
    </Block>
  </Container>
}
