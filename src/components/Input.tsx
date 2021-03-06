import React, {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState
} from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

export enum InputStatus {
  default = 'default',
  error = 'error'
}

const InputContainer = styled.input<{ status?: InputStatus; }>`
  height: 55px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  font-weight: 500;
  font-size: 15px;
  outline: none;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid;
  border-color: ${props => props.status === InputStatus.error ? props.theme.red : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 17px;
  font-family: Cairo, Helvetica,Arial,sans-serif;
  transition: border-color 250ms;

  ::placeholder {
    color: rgba(224, 224, 224, 0.75);
  }
  
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }

  ${({ status }) => status !== InputStatus.error && `
    :hover, :focus {
      border-color: #1D87D6;
    }
  `}
`

const TextAreaContainer = styled.textarea<{ status?: InputStatus; }>`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 15px;
  outline: none;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid;
  border-color: ${props => props.status === InputStatus.error ? props.theme.red : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 17px;
  font-family: Cairo, Helvetica,Arial,sans-serif;
  transition: border-color 250ms;

  ::placeholder {
    color: rgba(224, 224, 224, 0.75);
  }
  
  ${({ status }) => status !== InputStatus.error && `
    :hover, :focus {
      border-color: #1D87D6;
    }
  `}
`

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  status?: InputStatus;
  label?: string;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: InputStatus;
  label?: string;
}

const InputRaw = (props: InputProps, ref: any) => {
  return <InputContainer {...props} ref={ref} />
}

export const Input = React.forwardRef(InputRaw)

const TextAreaRaw = (props: TextAreaProps, ref: any) => {
  return <TextAreaContainer {...props} ref={ref} />
}

export const TextArea = React.forwardRef(TextAreaRaw)

interface InputExplainProps {
  text: string
}

const InputExplainContainer = styled.div`
  color: red;
`

export const InputExplain = (props: InputExplainProps) => {
  return <InputExplainContainer>
    {props.text}
  </InputExplainContainer>
}

export const InputTooltip = styled.div<{ isVisible?: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
  position: absolute;
  padding: 8px 0;
  background: white;
  border-radius: 8px;
  margin: auto;
  top: 0;
  left: 100%;
  width: 320px;
  margin-left: 16px;
  box-shadow: 0px 4px 72px rgba(0, 0, 0, 0.15);
  z-index: 10;
  
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: transparent #FFFFFF transparent transparent;
    top: 20px;
    left: -16px;
  }

  @media only screen and (max-width: 800px) {
    top: 70px;
    left: 0;
    right: 0;
    width: 100%;
    margin-left: unset;

    &:after {
      border-color: transparent transparent #FFFFFF transparent;
      top: -16px;
      left: calc(50% - 8px);
    }
  }
`

/* ===== SIMPLE INPUT ====== */

const SimpleInputContainer = styled.div<{ status?: InputStatus, value: any }>`
  position: relative;
  font-family: Cairo,sans-serif;
  width: 100%;
  font-style: normal;
  padding-top: 32px;
  // padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.darkBlue15};
  transition: border-color 250ms;
  
  ${({ value }) => value && `
    border-color: #7796b0;
  `}
  
  ${({ status }) => status === InputStatus.error && `
    border-color: #F0222B;
  `}
`

const SimpleInputLabel = styled.div<{ isOpened: boolean, status?: InputStatus }>`
  position: absolute;
  font-weight: 500;
  line-height: 16px;
  pointer-events: none;
  transition: bottom 350ms ease, color 350ms ease, font-size 350ms ease;
  color: ${props => props.theme.darkBlue50};
  bottom: ${props => props.isOpened ? '34px' : '12px'};
  font-size: ${props => props.isOpened ? '13px' : '15px'};

  ${({ status }) => status === InputStatus.error && `
    color: #F0222B;
  `}
`

const SimpleInputComponent = styled.input`
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  color: ${props => props.theme.darkBlue};
  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  outline: none;
  border: none;
  font-family: Cairo,sans-serif;
  background: transparent;
  margin-bottom: 2px;
  
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`

export interface SimpleInputProps extends InputProps {
  isFocused?: boolean;
  maxDecimals?: number;
  max?: number;
}

export const SimpleInput = (props: SimpleInputProps) => {
  const { label } = props
  const inputRef = useRef(null)
  const [value, setValue] = useState(props.value || '')
  const [isFocused, setFocused] = useState(props.isFocused || false)
  const maxDecimals = props.maxDecimals || 8

  useEffect(() => {
    setValue(props.value ? props.value.toString() : '')
  }, [props.value])

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    if (props.onFocus) {
      props.onFocus(e)
    }
  }
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    let value = e.target.value
    // Remove last chars for number with decimals
    if (props.type === 'number') {
      const delimiter = value.includes(',') ? ',' : value.includes('.') ? '.' : null
      if (delimiter) {
        const [mainPart, decimalPart] = value.split(delimiter)
        if (decimalPart.length > maxDecimals) {
          value = mainPart + delimiter + decimalPart.slice(0, maxDecimals)
          setValue(value)
        }
      }
      if (value.includes('-')) {
        value = value.replaceAll('-', '')
        setValue(value)
      }
      if (props.max) {
        if(new BigNumber(value).isGreaterThan(new BigNumber(props.max))) {
          value = new BigNumber(props.max).toString()
        }
      }
    }
    if (props.onBlur) {
      props.onBlur({
        ...e,
        target: {
          ...e.target,
          value
        }
      })
    }
  }
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue(value)
    if (props.onChange) {
      props.onChange(e)
    }
  }
  const onNumberOnlyChange = (event: any) => {
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    const isValid = new RegExp('[0-9,.]').test(keyValue)
    if (!isValid) {
      event.preventDefault()
      return
    }
  }
  const status = isFocused ? InputStatus.default : props.status
  return <SimpleInputContainer status={status} value={value || props.value}>
    {label &&
      <SimpleInputLabel
        isOpened={isFocused || props.isFocused || !!value || !!props.value}
        status={status}
      >
        {label}
      </SimpleInputLabel>
    }
    <SimpleInputComponent
      {...props}
      ref={inputRef}
      value={value}
      onKeyPress={props.type === 'number' ? onNumberOnlyChange : undefined}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
    />
  </SimpleInputContainer>
}

