import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { PrimaryTitle } from '../../../../components/PrimaryTitle'
import { PrimaryModal } from '../../Modal'
import { Block } from '../../../../components/Block'
import { IBatch } from '../../../../interfaces'
import { Pagination } from './Pagination'
import useScrollHandler from '../../../../hooks/useScrollHandler'
import { BatchDetails } from './BatchDetails'
import { BatchOperation } from '../../../../constants'
import { BatchLiquidation } from './BatchLiquidation'
import { BatchItem, BatchWidth } from './BatchItem'
import { ClaimOverpay } from './ClaimOverpay'
import { PostponeLiquidation } from './PostponeLiquidation'

interface IProps {
  onClose: () => void
}

const Container = styled.div`
  
`

const Description = styled.div`
  margin: 0 auto;
  max-width: 500px;
  font-family: Cairo,sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
`

const BatchesItemsContainer = styled.div`
  position: relative;
  display: flex;
  overflow: auto;
  width: calc(100% + 120px); // 60px = parent padding
  height: calc(194px + 32px);
  padding-top: 48px; // For batch item animation to top
  padding-bottom: 72px; // For batch item animation to top
  margin-left: -60px;
  align-items: flex-end;
  scrollbar-width: none; // Disable scrollbar
  ::-webkit-scrollbar {
    display: none;
  }
  
  > div:first-child {
    margin-left: 60px;
  }
  
  //::after {
  //  content: "";
  //  position: absolute;
  //  width: 100%;
  //  height: 100%;
  //  box-shadow: inset -24px 0 16px -8px white;
  //}
`

const PrimaryWrapper = styled.div<{ isVisible: boolean }>`
  transition: transform 500ms cubic-bezier(.7,0,.6,1), opacity 500ms;
  ${({ isVisible }) => !isVisible && `
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

const BatchesOnPage = 3

export const Batches = (props: IProps) => {
  const batches: IBatch[] = [{
    id: '1',
    eastAmount: 80,
    westAmount: 50,
    usdpAmount: 14,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '2',
    eastAmount: 120,
    westAmount: 76,
    usdpAmount: 123,
    westRate: 0.31,
    createdAt: Date.now()
  }, {
    id: '3',
    eastAmount: 32,
    westAmount: 12,
    usdpAmount: 2,
    westRate: 0.12,
    createdAt: Date.now()
  }, {
    id: '4',
    eastAmount: 504,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '5',
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '6',
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '7',
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '8',
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '9',
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '10',
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '11',
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
    createdAt: Date.now()
  }, {
    id: '12',
    eastAmount: 100,
    westAmount: 219,
    usdpAmount: 22,
    westRate: 0.52,
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
    <PrimaryWrapper isVisible={!batchOperation}>
      <PrimaryModal {...props}>
        <PrimaryTitle>Batches</PrimaryTitle>
        <Block marginTop={40} />
        <Description>
          Batch is like a container with your WEST and USDp. A new batch is created every time you buy EAST. Learn more
        </Description>
        <Block marginTop={16} />
        <BatchesItemsContainer ref={containerRef}>
          {batches.map((batch, index) => {
            const grad = gradients[index % gradients.length]
            const batchItemProps = {
              batch,
              background: grad.background,
              isActive: openedBatchIndex === index,
              onClick: () => openedBatchIndex === index ? setOpenedBatchIndex(null) : setOpenedBatchIndex(index)
            }
            return <BatchItem key={index} batchIndex={batches.length - index} {...batchItemProps} />
          })}
        </BatchesItemsContainer>
        <div>
          {batches.length > BatchesOnPage &&
          <Pagination
            currentPage={batchesPage}
            totalPages={Math.ceil(batches.length / BatchesOnPage)}
            onPageSelected={onPageSelected}
          />
          }
        </div>
      </PrimaryModal>
    </PrimaryWrapper>
    <BatchLiquidation
      batch={openedBatchItem}
      isVisible={batchOperation === BatchOperation.liquidate}
      onClose={() => setBatchOperation(null)}
    />
    <ClaimOverpay
      batch={openedBatchItem}
      isVisible={batchOperation === BatchOperation.overpay}
      onClose={() => setBatchOperation(null)}
    />
    <PostponeLiquidation
      batch={openedBatchItem}
      isVisible={batchOperation === BatchOperation.postponeLiquidation}
      onClose={() => setBatchOperation(null)}
    />
  </Container>
}
