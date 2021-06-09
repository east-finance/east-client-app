import styled from 'styled-components'

export const TextTable = styled.div`
  margin: 0 auto;
  text-align: left;
`

export const TextTableRow = styled.div`
  display: flex;
  justify-content: end;
  align-items: baseline;
  
  &:not(:first-child) {
      margin-top: 24px;
  }
`

export const TextTableKey = styled.div`
  width: 40%;
  margin-left: 10%;
  color: #000000;
  opacity: 0.6;
  font-size: 15px;
`

export const TextTablePrimaryValue = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: #000000;
`

export const TextTableSecondaryValue = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #525252;
`
