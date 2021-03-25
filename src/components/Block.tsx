import styled from 'styled-components'

export const Block = styled.div<{ marginTop: number }>`
  margin-top: ${({ marginTop = 0 }) => marginTop}px;
`

export const Block16 = styled.div`
  margin-top: 16px;
`

export const Block24 = styled.div`
  margin-top: 24px;
`

export const Block32 = styled.div`
  margin-top: 32px;
`
