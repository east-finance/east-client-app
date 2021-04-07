import React, { InputHTMLAttributes, useState } from 'react'
import styled from 'styled-components'

const InputContainer = styled.input`
  height: 55px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  background: #E5E5E5;
  box-shadow: inset -4px -4px 4px rgba(247, 247, 247, 0.25), inset 2px 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
  border: none;
  outline: none;
  font-family: Montserrat,Helvetica,Arial,sans-serif;
`

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = (props: InputProps) => {
  return <InputContainer {...props} />
}
