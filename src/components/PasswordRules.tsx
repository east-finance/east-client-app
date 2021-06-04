import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  color: black;
`

const PasswordErrors = {
  MinLength: 'MinLength',
  Seq: 'Seq',
  RequiredLowerCase: 'RequiredLowerCase',
  RequiredUpperCase: 'RequiredUpperCase',
  RequiredNumber: 'RequiredNumber',
  RequiredSpecialChar: 'RequiredSpecialChar',
  OnlyLatin: 'OnlyLatin'
}

export const PasswordMinLength = 8
export const PasswordMaxLength = 30

export const getPasswordStrength = (value: string) => {
  const failed = []

  if (!value) {
    return Object.values(PasswordErrors)
  }

  if (value.length < PasswordMinLength || value.length > PasswordMaxLength) {
    failed.push(PasswordErrors.MinLength)
  }
  if (/(.)\1{2,}/.test(value)) {
    failed.push(PasswordErrors.Seq)
  }
  if (!/[a-zа-я]/.test(value)) {
    failed.push(PasswordErrors.RequiredLowerCase)
  }
  if (!/[A-ZА-Я]/.test(value)) {
    failed.push(PasswordErrors.RequiredUpperCase)
  }
  if (!/[0-9]/.test(value)) {
    failed.push(PasswordErrors.RequiredNumber)
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    failed.push(PasswordErrors.RequiredSpecialChar)
  }
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7FâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ]+/.test(value) || !/[A-Za-z]/.test(value)) {
    failed.push(PasswordErrors.OnlyLatin)
  }
  return failed
}

const RowContainer = styled.div<{ isPassed?: boolean }>`
  display: flex;
  padding: 0 16px;
  color: ${props => props.isPassed ? props.theme.gray : props.theme.black};
`

const RowText = styled.div`
  margin-left: 8px;
  font-size: 13px;
`

const CheckContainer = styled.div`
  width: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DotSymbol = styled.div`
  width: 4px;
  height: 4px;
  text-align: center;
  background: black;
  border-radius: 50%;
`

interface IRowProps {
  isPassed: boolean;
  text: string;
}

const ValidationRow = (props: IRowProps) => {
  const { isPassed, text } = props
  return <RowContainer isPassed={isPassed}>
    {isPassed &&
      <CheckContainer>✓</CheckContainer>
    }
    {!isPassed &&
      <CheckContainer>
        <DotSymbol />
      </CheckContainer>
    }
    <RowText>{text}</RowText>
  </RowContainer>
}

export interface IProps {
  password: string;
}

export const PasswordRules = (props: IProps) => {
  const errors = getPasswordStrength(props.password)
  return <Container>
    <ValidationRow isPassed={!errors.includes(PasswordErrors.MinLength)} text={`From ${PasswordMinLength} to ${PasswordMaxLength} characters`} />
    <ValidationRow isPassed={!errors.includes(PasswordErrors.OnlyLatin)} text={'Only latin characters'} />
    <ValidationRow isPassed={!errors.includes(PasswordErrors.RequiredLowerCase) && !errors.includes(PasswordErrors.RequiredUpperCase)} text={'Both uppercase and lowercase'} />
    <ValidationRow isPassed={!errors.includes(PasswordErrors.RequiredNumber)} text={'At least 1 digit'} />
    <ValidationRow isPassed={!errors.includes(PasswordErrors.RequiredSpecialChar)} text={'At least 1 special char (@#&% etc.)'} />
    <ValidationRow isPassed={!errors.includes(PasswordErrors.Seq)} text={'No more than two identical symbols in a row'} />
  </Container>
}

export enum FormErrors {
  EnterEmail = 'Enter an email',
  EnterPassword = 'Enter a password',
  EnterConfirm = 'Confirm password',
  EmailIsIncorrect = 'Email is incorrect',
  EmailIsTooLong = 'Email is too long',
  PasswordsNotMatch = 'Passwords do not match',
  PasswordRules = 'Check password rules',
  ConfirmRules = 'Check confirm rules'
}
