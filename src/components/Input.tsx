import React, { InputHTMLAttributes, useState } from 'react'
import styled from 'styled-components'
import { Block, Block16 } from './Block'

export enum InputStatus {
  default = 'default',
  error = 'error'
}

const InputContainer = styled.input<{ status?: InputStatus }>`
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

  ::placeholder {
    color: rgba(224, 224, 224, 0.75);
  }
`

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  status?: InputStatus;
  label?: string;
}

export const Input = (props: InputProps) => {
  return <InputContainer {...props} />
}

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

/* ===== SIMPLE INPUT ====== */

const SimpleInputContainer = styled.div`
  position: relative;
  height: 56px;
  font-family: Cairo,sans-serif;
  width: 100%;
  font-style: normal;
  padding-top: 16px;
`

const SimpleInputLabel = styled.div<{ isOpened: boolean }>`
  position: absolute;
  font-weight: 500;
  line-height: 16px;
  pointer-events: none;
  transition: top 250ms ease, color 250ms ease, font-size 250ms ease;
  color: ${props => props.isOpened ? '#8D8D8D' : '#8D8D8D'};
  top: ${props => props.isOpened ? '-8px' : '16px'};
  font-size: ${props => props.isOpened ? '13px' : '15px'};
`

const SimpleInputComponent = styled.input`
  height: 16px;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  color: #0A0606;
  font-weight: 500;
  font-size: 15px;
  line-height: 16px;
  outline: none;
  border: none;
  font-family: Cairo,sans-serif;
  background: transparent;
`

const SimpleInputLine = styled.div`
  height: 1px;
  width: 100%;
  background: #C4C4C4;
`

export interface SimpleInputProps extends InputProps {
  isFocused?: boolean;
}

export const SimpleInput = (props: SimpleInputProps) => {
  const { label } = props
  const [value, setValue] = useState(props.value || '')
  const [isFocused, setFocused] = useState(props.isFocused || false)
  const onFocus = (e: any) => {
    setFocused(true)
    if (props.onFocus) {
      props.onFocus(e)
    }
  }
  const onBlur = (e: any) => {
    setFocused(false)
    if (props.onBlur) {
      props.onBlur(e)
    }
  }
  const onChange = (e: any) => {
    setValue(e.target.value)
    if (props.onChange) {
      props.onChange(e)
    }
  }
  return <SimpleInputContainer>
    {label &&
      <SimpleInputLabel isOpened={isFocused || props.isFocused || !!value}>
        {label}
      </SimpleInputLabel>
    }
    <SimpleInputComponent {...props} onFocus={onFocus} onBlur={onBlur} onChange={onChange} />
    <Block marginTop={8}>
      <SimpleInputLine />
    </Block>
  </SimpleInputContainer>
}

