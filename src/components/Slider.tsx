import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export interface IProps {
  min: number;
  max: number;
  defaultValue: number;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  background: #C4C4C4;
  height: 2px;
  width: 100%;
`

const PointerSize = 16

const Pointer = styled.div`
  width: ${PointerSize}px;
  height: ${PointerSize}px;
  border-radius: 16px;
  cursor: pointer;
  background: radial-gradient(204.55% 3032.86% at 67.55% 85.45%, rgba(172, 171, 216, 0) 0%, #514EFF 100%), #1D87D6;
  pointer-events: none;
`

export const Slider = (props: IProps) => {
  const initialValue = Math.round(Math.abs(props.max - props.min) / 2)
  const containerRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HTMLDivElement>(null)

  const [currentValue, setCurrentValue] = useState(initialValue)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [isMouseDown, setMouseDown] = useState(false)

  const getContainerWidth = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return containerRef.current ? containerRef.current.clientWidth : 0
  }

  const getValueByOffset = (offset: number) => {
    const value = 0
    const percent = offset / getContainerWidth()
    return value
  }

  const updatePointerPosition = (e: any) => {
    const containerWidth = getContainerWidth()
    if (pointerRef.current && e.target) {
      // let offset = e.screenX - e.offsetX
      let offset = e.offsetX
      if (offset + PointerSize > containerWidth) {
        offset = containerWidth - PointerSize
      }
      if (offset < 0) {
        offset = 0
      }
      pointerRef.current.style.marginLeft = offset.toString() + 'px'
      const value = getValueByOffset(offset)
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    setMouseDown(false)
  }

  const handleMouseMove = (e: any) => {
    if (containerRef.current && containerRef.current.isSameNode(e.target)) {
      updatePointerPosition(e)
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    setMouseDown(true)
    updatePointerPosition(e)
  }

  useEffect(() => {
    setOffsetLeft(Math.round(getContainerWidth() / 2))
    if (containerRef.current) {
      containerRef.current.addEventListener('mousedown', handleMouseDown)
      containerRef.current.addEventListener('mouseup', handleMouseUp)
      containerRef.current.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousedown', handleMouseDown)
        containerRef.current.removeEventListener('mouseup', handleMouseUp)
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [containerRef])

  return <Container ref={containerRef}>
    <Pointer ref={pointerRef} />
  </Container>
}
