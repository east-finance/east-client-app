import styled from 'styled-components'

export const TextTable = styled.div`
  margin: 0 auto;
  text-align: left;
  font-family: Cairo;
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
  min-width: 40%;
  margin-right: 20px;
  color: ${props => props.theme.darkBlue50};
  font-size: 15px;
  text-align: right;
`

export const TextTablePrimaryValue = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: #081D52;
`

export const TextTableSecondaryValue = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
  color: #043569;
`

export const TextTableInfo = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: rgba(4, 53, 105, 0.5);
`
