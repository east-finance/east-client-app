import { IBatch } from '../../../../interfaces'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
`

const PagesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const Arrow = styled.i`
  border: solid black;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 2px;
  width: 4px;
  height: 4px;
  cursor: pointer;
`

const ArrowLeft = styled(Arrow)`
  transform: rotate(135deg);
`

const ArrowRight = styled(Arrow)`
  transform: rotate(-45deg);
`

const ArrowContainer = styled.div`
  padding-bottom: 24px;
`

const Page = styled.div<{ isActive: boolean }>`
  width: 2px;
  height: ${props => props.isActive ? '56px' : '24px'};
  background-color: ${props => props.isActive ? '#000000' : '#C4C4C4'};
  transition: height 250ms, background-color 250ms;
  
  &:not(:first-child) {
    margin-left: 8px;
  }
`

interface IProps {
  currentPage: number;
  totalPages: number;
  onPageSelected: (page: number) => void;
}

export const Pagination = (props: IProps) => {
  const { totalPages, currentPage, onPageSelected } = props
  const pages = []
  for (let i = 0; i < totalPages; i++) {
    pages.push(<Page key={i} isActive={i === currentPage} />)
  }
  const onArrowLeftClicked = () => {
    onPageSelected(currentPage > 0 ? currentPage - 1 : totalPages - 1)
  }
  const onArrowRightClicked = () => {
    onPageSelected(currentPage < totalPages - 1 ? currentPage + 1 : 0)
  }
  return <Container>
    <PagesContainer>
      <ArrowContainer style={{ marginRight: '32px' }} onClick={onArrowLeftClicked}>
        <ArrowLeft />
      </ArrowContainer>
      {pages}
      <ArrowContainer style={{ marginLeft: '32px' }} onClick={onArrowRightClicked}>
        <ArrowRight />
      </ArrowContainer>
    </PagesContainer>
  </Container>
}
