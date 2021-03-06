import React from 'react'
import styled from 'styled-components'
import copy from 'copy-to-clipboard'
import { Block } from '../../../components/Block'
import useStores from '../../../hooks/useStores'
import iconCopy from '../../../resources/images/icon-copy.png'
import exchangeLogo from '../../../resources/images/waves-exchange-logo.png'
import { toast } from 'react-toastify'
import { InfoNotification, NotificationType, ToastCloseButton } from '../../../components/Notification'
import { ButtonsContainer, NavigationLeftGradientButton } from '../../../components/Button'
import { roundNumber } from '../../../utils'

interface IProps {
  westAmount: string;
  eastAmount?: string;
  onPrevClicked: () => void;
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
  margin: 16px auto;
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
  padding: 12px 8px;
  background: rgba(4, 53, 105, 0.15);
  border-radius: 8px;
  font-family: Cairo,sans-serif;
  font-weight: bold;
  font-size: 23px;
  line-height: 24px;
  color: #043569;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`

const Info = styled.div`
  text-align: center;
  color: rgba(4, 53, 105, 0.5);
  font-size: 15px;
  line-height: 24px;
`

const ExchangeList = styled.div`
  display: flex;
  justify-content: center;

  > a:not(:first-child) {
    margin-left: 24px;
  }
`

const ExchangeItem = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #C4C4C4;
  background-repeat: no-repeat;
  cursor: pointer;
  border: 1px solid transparent;
  background-image: url(${exchangeLogo});
  background-size: 48px;
  background-position: center;

  :hover {
    border-color: black;
  }
`

export const AddWestToAddress = (props: IProps) => {
  const { authStore } = useStores()
  const onCopyClicked = () => {
    copy(authStore.address)
    toast(<InfoNotification title={'Copied!'} />, {
      hideProgressBar: true,
      closeButton: <ToastCloseButton type={NotificationType.default} closeToast={() => toast.dismiss()} />
    })
  }
  return <Container>
    <Description>
      Add <Amount>{roundNumber(props.westAmount)} WEST</Amount> to your address{props.eastAmount && ` to get ${props.eastAmount} EAST`}
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
    <Block marginTop={24}>
      <ExchangeList>
        <ExchangeItem href={'https://waves.exchange/withdraw/WEST'} target={'_blank'} />
      </ExchangeList>
    </Block>
    <Block marginTop={40}>
      <Centered>
        <Info>
          Transfers between different blockchains sometimes take up to a couple of hours
        </Info>
      </Centered>
    </Block>
    <Block marginTop={32}>
      <ButtonsContainer>
        <NavigationLeftGradientButton onClick={props.onPrevClicked} />
      </ButtonsContainer>
    </Block>
  </Container>
}
