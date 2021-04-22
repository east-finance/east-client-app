import React, { InputHTMLAttributes, useState } from 'react'
import styled from 'styled-components'

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
