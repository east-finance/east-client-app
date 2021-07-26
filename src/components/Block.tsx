import styled from 'styled-components'

export const Block = styled.div<{ marginTop: number | string }>`
  margin-top: ${({ marginTop = 0 }) => typeof marginTop === 'number' ? `${marginTop}px` : marginTop};
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
