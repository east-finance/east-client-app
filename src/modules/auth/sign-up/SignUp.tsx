import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Block, Block16, Block24 } from '../../../components/Block'
import styled from 'styled-components'
import useStores from '../../../hooks/useStores'
import { Input, InputStatus, InputTooltip } from '../../../components/Input'
import { Button } from '../../../components/Button'
import { validateEmail } from '../utils'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ErrorNotification } from '../../../components/Notification'
import { FormErrors, getPasswordStrength, PasswordRules } from '../../../components/PasswordRules'
import { BeforeText, RelativeContainer, Spinner } from '../../../components/Spinner'

const Container = styled.div`
  width: 376px;
`

const InputWrapper = styled.div`
  position: relative;
`

const SuccessMessage =  styled.div`
  font-size: 18px;
  font-weight: 500;
`

const SecondaryText = styled.div`
  font-weight: 300;
  font-size: 16px;
`

const H3 = styled.div`
  font-weight: 600;
  font-size: 22px;
`

enum FormProp {
  email = 'email',
  password = 'password',
  confirm = 'confirm'
}

const defaultFormState = { value: '', prevValue: '', error: '', isFocused: false }

const SignUp = () => {
  const { api } = useStores()

  const firstRender = useRef(true)
  const [email, setEmail] = useState(defaultFormState)
  const emailRef = useRef<HTMLDivElement>(null)
  const [password, setPassword] = useState(defaultFormState)
  const passwordRef = useRef<HTMLDivElement>(null)
  const [confirm, setConfirm] = useState(defaultFormState)
  const confirmRef = useRef<HTMLDivElement>(null)

  const [inProgress, setInProgress] = useState(false)
  const [isRegistered, setRegistered] = useState(false)
  const [validateTimerId, setValidateTimerId] = useState<any>(null)

  const throttleValidation = (prop: FormProp) => {
    if (validateTimerId) {
      clearTimeout(validateTimerId)
    }
    const id = setTimeout(() => {
      const { errors } = validateForm()
      const error = errors[prop]
      toast.dismiss()
      if (error) {
        toast(<ErrorNotification text={error} />, {
          hideProgressBar: true,
          autoClose: 600000
        })
      }
      if (prop === FormProp.email) {
        setEmail({...email, error: errors.email})
      } else if (prop  === FormProp.password) {
        setPassword({...password, error: errors.password})
      } else if (prop === FormProp.confirm) {
        setConfirm({...confirm, error: errors.confirm})
      }
    }, 1000)
    setValidateTimerId(id)
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    let changedProp = FormProp.email
    if (password.value !== password.prevValue) {
      changedProp = FormProp.password
    }
    if (confirm.value !== confirm.prevValue) {
      changedProp = FormProp.confirm
    }
    throttleValidation(changedProp)
  }, [email.value, password.value, confirm.value])

  const onChangeLogin = (e: ChangeEvent<HTMLInputElement>) => setEmail({...email, value: e.target.value.trim(), prevValue: email.value })
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword({...password, value: e.target.value.trim(), prevValue: password.value})
  const onChangeConfirm = (e: ChangeEvent<HTMLInputElement>) => setConfirm({...confirm, value: e.target.value.trim(), prevValue: confirm.value})

  const validateForm = () => {
    const errors = { email: '', password: '', confirm: '' }
    if(!email.value) {
      errors.email = FormErrors.EnterEmail
    } else if(!validateEmail(email.value)) {
      if (email.value.length > 64) {
        errors.email = FormErrors.EmailIsTooLong
      } else {
        errors.email = FormErrors.EmailIsIncorrect
      }
    }
    if (password.value) {
      const rulesErrors = getPasswordStrength(password.value)
      if (rulesErrors.length > 0) {
        errors.password = FormErrors.PasswordRules
      }
    } else {
      errors.password = FormErrors.EnterPassword
    }
    if (confirm.value) {
      const rulesErrors = getPasswordStrength(confirm.value)
      if (rulesErrors.length > 0) {
        errors.confirm = FormErrors.ConfirmRules
      }
    } else {
      errors.confirm = FormErrors.EnterConfirm
    }
    if (password.value && confirm.value && password.value !== confirm.value) {
      errors.confirm = FormErrors.PasswordsNotMatch
    }
    const errorMessage = errors.email || errors.password || errors.confirm || ''
    return {
      errors,
      errorMessage
    }
  }

  const onSignUpClicked = async () => {
    if (validateTimerId) {
      clearTimeout(validateTimerId)
    }

    const { errors, errorMessage } = validateForm()
    setEmail({...email, error: errors.email})
    setPassword({...password, error: errors.password})
    setConfirm({...confirm, error: errors.confirm})

    if (errors.email) {
      if (emailRef.current) {
        emailRef.current.focus()
      }
    } else if(errors.password) {
      if (passwordRef.current) {
        passwordRef.current.focus()
      }
    } else if(errors.confirm) {
      if (confirmRef.current) {
        confirmRef.current.focus()
      }
    }

    toast.dismiss()

    if (errorMessage) {
      toast(<ErrorNotification text={errorMessage} />, {
        hideProgressBar: true,
        autoClose: 600000
      })
    }
    if (!errorMessage) {
      try {
        setInProgress(true)
        await api.signUp(email.value, password.value)
        setRegistered(true)
      } catch (e) {
        console.log('Signup error:', e.message)
        const { errors } =  e.response.data
        let emailError = ''
        let passwordError = ''
        if (errors.includes('user.already.exists')) {
          emailError = 'Email address is not available'
        } else if(errors.includes('password.does.not.meet.the.requirements')) {
          passwordError = 'Password does not meet the requirements'
        } else {
          emailError = 'Unknown error. Try again later.'
        }
        toast(<ErrorNotification text={emailError || passwordError} />, {
          hideProgressBar: true,
          autoClose: 600000
        })
        if (emailError) {
          setEmail({...email, error: emailError})
        }
        if (passwordError) {
          setPassword({...email, error: passwordError})
        }
      } finally {
        setInProgress(false)
      }
    }
  }

  const onSignUpPressed = (e: any) => {
    if(e.keyCode === 13) {
      if (!inProgress) {
        e.preventDefault()
        onSignUpClicked()
      }
    }
  }

  if(isRegistered) {
    return <Container>
      <Block24>
        <H3 style={{ textAlign: 'center' }}>Complete registration</H3>
        <Block16>
          <SuccessMessage>We sent an email to {email.value}.</SuccessMessage>
          <Block16>
            <SecondaryText>Follow the link to confirm your e-mail.</SecondaryText>
          </Block16>
        </Block16>
        <Block marginTop={54}>
          <Button type={'primary'} onClick={() => setRegistered(false)}>Sign Up again</Button>
        </Block>
      </Block24>
    </Container>
  }

  return <Container>
    <Input
      ref={emailRef}
      placeholder={'Email'}
      status={email.error ? InputStatus.error : InputStatus.default}
      onChange={onChangeLogin}
      onKeyDown={onSignUpPressed}
    />
    <Block24>
      <InputWrapper>
        <Input
          ref={passwordRef}
          placeholder={'Password'}
          type={'password'}
          status={password.error ? InputStatus.error : InputStatus.default}
          onChange={onChangePassword}
          onFocus={() => setPassword({...password, isFocused: true})}
          onBlur={() => setPassword({...password, isFocused: false})}
          onKeyDown={onSignUpPressed}
        />
        <InputTooltip isVisible={password.isFocused}>
          <PasswordRules password={password.value} />
        </InputTooltip>
      </InputWrapper>
    </Block24>
    <Block24>
      <InputWrapper>
        <Input
          ref={confirmRef}
          placeholder={'Confirm password'}
          type={'password'}
          status={confirm.error ? InputStatus.error : InputStatus.default}
          onChange={onChangeConfirm}
          onFocus={() => setConfirm({...confirm, isFocused: true})}
          onBlur={() => setConfirm({...confirm, isFocused: false})}
          onKeyDown={onSignUpPressed}
        />
        <InputTooltip isVisible={confirm.isFocused}>
          <PasswordRules password={confirm.value} />
        </InputTooltip>
      </InputWrapper>
    </Block24>
    <Block marginTop={54}>
      <Button type={'primary'} disabled={inProgress} onClick={onSignUpClicked}>
        <RelativeContainer>
          {inProgress &&
          <BeforeText>
            <Spinner />
          </BeforeText>
          }
          Sign Up
        </RelativeContainer>
      </Button>
    </Block>
  </Container>
}

export default SignUp
