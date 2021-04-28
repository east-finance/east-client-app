import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { Block, Block16 } from '../../../../components/Block'
import { IBatch } from '../../../../interfaces'
import { Pagination } from './Pagination'
import useScrollHandler from '../../../../hooks/useScrollHandler'
import { BatchDetails } from './BatchDetails'
import { BatchOperation } from '../../../../constants'
import { BatchLiquidation } from './BatchLiquidation'

interface IProps {
  onClose: () => void
}

const Container = styled.div`
  
`

const Description = styled.div`
  margin: 0 auto;
  max-width: 500px;
  font-family: Montserrat,sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
`

const BatchesItemsContainer = styled.div`
  position: relative;
  display: flex;
  overflow: auto;
  width: calc(100% + 60px); // 60px = parent padding
  height: calc(194px + 32px);
  padding-top: 32px; // For batch item animation to top
  align-items: flex-end;
  
  //::after {
  //  content: "";
  //  position: absolute;
  //  width: 100%;
  //  height: 100%;
  //  box-shadow: inset -24px 0 16px -8px white;
  //}
`

const BatchItem = styled.div<{ background: string; batchWidth: number; isActive?: boolean }>`
  box-sizing: border-box;
  width: ${props => props.batchWidth}px;
  min-width: ${props => props.batchWidth}px;
  height: 194px;
  background: ${props => props.background};
  padding: 16px;
  cursor: pointer;
  margin-right: 16px;
  border: 2px solid white;
  border-radius: 4px;
  transition: margin-bottom 250ms ease-in-out;
  
  // &:hover {
  //   margin-bottom: ${props => props.isActive ? '28' : '8'}px;
  // }

  ${({ isActive }) => isActive && `
    margin-bottom: 28px;
    border-image-slice: 1;
    border-image-source: linear-gradient(to left, #743ad5, #d53a9d);
  `}
`

const BatchTitle = styled.div`
  font-family: Cairo,sans-serif;
  font-weight: bold;
  font-size: 20px;
  line-height: 16px;
  color: #000000;
`

const BatchSubTitle = styled.div`
  font-family: Cairo,sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: #000000;
`

const BatchText = styled.div`
  font-family: Cairo,sans-serif;
  font-weight: normal;
  font-size: 15px;
  line-height: 16px;
  color: #000000;
  max-width: 70px;
`

const PrimaryWrapper = styled.div<{ isHidden: boolean }>`
  transition: transform 500ms cubic-bezier(.7,0,.6,1), opacity 500ms;
  ${({ isHidden }) => isHidden && `
    opacity: .3;
    transform: translate(150px, -650px);
    user-select: none;
  `}
`

const gradients = [{
  background: 'linear-gradient(180deg, #F2F2F2 0%, #EDEDED 100%);'
}, {
  background: 'radial-gradient(114.95% 114.95% at 5.23% -14.95%, #2CFF5A 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, #F2F2F2 0%, #EDEDED 100%);'
}, {
  background: 'radial-gradient(114.95% 114.95% at 5.23% -14.95%, #FF842C 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, #F2F2F2 0%, #EDEDED 100%);'
}]

export const BatchWidth = 153
const BatchesOnPage = 3

export const Batches = (props: IProps) => {
  const batches: IBatch[] = [{
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }, {
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    createdAt: Date.now()
  }]

  const [openedBatchIndex, setOpenedBatchIndex] = useState<number | null>(null)
  const [batchesPage, setBatchesPage] = useState(0)
  const [batchOperation, setBatchOperation] = useState<BatchOperation | null>(null)

  const containerRef = useRef(null)
  useScrollHandler(containerRef, (scrollLeft: number) => {
    setBatchesPage(Math.floor(scrollLeft / (BatchWidth * BatchesOnPage)))
  })

  const onPageSelected = (page: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // containerRef.current.scrollLeft = page * (BatchWidth * BatchesOnPage + (16 * (BatchesOnPage - 1)))
    containerRef.current.scrollTo({
      top: 0,
      left: Math.floor(page * ((BatchWidth + 16) * BatchesOnPage + 92)),
      behavior: 'smooth'
    })

    setBatchesPage(page)
  }

  const openedBatchItem = batches.find((_, index) => index === openedBatchIndex)
  const onOperationClicked = (operation: BatchOperation) => {
    setBatchOperation(operation)
  }

  return <Container>
    <BatchDetails
      batch={openedBatchItem}
      onOperationClicked={onOperationClicked}
      onClose={() => {
        setOpenedBatchIndex(null)
        setBatchOperation(null)
      }}
    />
    <PrimaryWrapper isHidden={!!batchOperation}>
      <PrimaryModal {...props}>
        <PrimaryTitle>Batches</PrimaryTitle>
        <Block marginTop={40} />
        <Description>
          Batches are roughly like transaction history. Each batch has a vault with blocked WEST and USDp. Read more
        </Description>
        <Block marginTop={72} />
        <BatchesItemsContainer ref={containerRef}>
          {batches.map((batch, index) => {
            const grad = gradients[index % gradients.length]
            const isActive = openedBatchIndex === index
            return <BatchItem
              key={index}
              isActive={isActive}
              background={grad.background}
              batchWidth={BatchWidth}
              onClick={() => setOpenedBatchIndex(index)}
            >
              <BatchTitle>Index {index}</BatchTitle>
              <BatchTitle>{batch.eastAmount} East</BatchTitle>
              <Block16 />
              <BatchText>
                112 West
                at 0.2253$
              </BatchText>
              <Block16 />
              <BatchSubTitle>In vault</BatchSubTitle>
              <Block marginTop={8} />
              <BatchText>
                112 West
                at 0.2253$
              </BatchText>
            </BatchItem>
          })}
        </BatchesItemsContainer>
        <Block marginTop={72}>
          {batches.length > BatchesOnPage &&
          <Pagination
            currentPage={batchesPage}
            totalPages={Math.ceil(batches.length / BatchesOnPage)}
            onPageSelected={onPageSelected}
          />
          }
        </Block>
      </PrimaryModal>
    </PrimaryWrapper>
    <BatchLiquidation
      batch={openedBatchItem}
      isVisible={!!batchOperation}
      onClose={() => setBatchOperation(null)}
    />
  </Container>
}
