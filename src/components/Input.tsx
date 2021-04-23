import React, { InputHTMLAttributes, useState } from 'react'
import styled from 'styled-components'
import { Block, Block16 } from './Block'

const InputContainer = styled.input`
  height: 55px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  font-weight: 500;
  font-size: 13px;
  outline: none;
  //font-family: Montserrat,Helvetica,Arial,sans-serif;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 17px;
`

type InputProps = InputHTMLAttributes<HTMLInputElement>

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

interface ISimpleInputProps {
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  title?: string;
  placeholder?: string;
  onChange?: (e: any) => void;
}

const SimpleInputContainer = styled.div`
  font-family: Cairo,sans-serif;
  width: 100%;
  font-style: normal;
`

const SimpleInputComponent = styled.input`
  height: 25px;
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

const SimpleInputTitle = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #8D8D8D;
`

const SimpleInputLine = styled.div`
  height: 1px;
  width: 100%;
  background: #C4C4C4;
`

export const SimpleInput = (props: ISimpleInputProps) => {
  const { title } = props
  return <SimpleInputContainer>
    {title &&
      <SimpleInputTitle>
        {title}
      </SimpleInputTitle>
    }
    <Block marginTop={4} />
    <SimpleInputComponent {...props} />
    <Block16 />
    <SimpleInputLine />
  </SimpleInputContainer>
}

