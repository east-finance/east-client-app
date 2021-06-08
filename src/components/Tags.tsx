import styled from 'styled-components'
import React from 'react'

export interface ITag {
  text: string;
  value: string;
}

export interface IProps {
  data: ITag[];
  onClick?: (data: ITag) => void;
}

const Container = styled.div`
  display: flex;
  font-family: Cairo;
  font-size: 13px;
  line-height: 16px;
`

const Option = styled.div`
  padding: 4px;
  cursor: pointer;
  background: rgba(29, 135, 214, 0.4);
  border-radius: 4px;
  color: ${props => props.theme.darkBlue};
  
  :not(:first-child) {
    margin-left: 8px;
  }
`

export const Tags = (props: IProps) => {
  const onClick = (data: ITag) => {
    if (props.onClick) {
      props.onClick(data)
    }
  }
  return <Container>
    {props.data.map((option, index) => {
      return <Option key={index} onClick={() => onClick(option)}>
        {option.text}
      </Option>
    })}
  </Container>
}
