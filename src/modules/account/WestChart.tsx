import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Block } from '../../components/Block'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { IDataPoint } from '../../stores/DataStore'
import moment from 'moment'

const chartHeight = 50
const topOffset = 10

const getMinMax = (points: IDataPoint[]) => {
  let min = 0
  let max = 0
  if (points.length > 0) {
    const sorted = [...points].sort((a, b) => +a.value - +b.value)
    min = +sorted[0].value
    max = +sorted[sorted.length - 1].value
  }
  return { min, max }
}

export const WestChart = observer( () => {
  const { dataStore } = useStores()
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(100)
  const points = toJS(dataStore.westPriceHistory)
  const canvasRef = useRef(null)

  const draw = (ctx: any) => {
    if (points.length === 0) {
      return false
    }
    console.log('from', moment(points[0].timestamp).format(), 'to', moment(points[points.length - 1].timestamp).format())
    const { min, max } = getMinMax(points)
    const xStep = Math.ceil(canvasWidth / points.length)
    ctx.translate(0.5, 0.5)
    ctx.lineWidth = 2
    ctx.beginPath()

    let xPosition = 0

    const getYPosition = (value: number) => {
      const yPercent = ((value - min) / (max - min))
      return topOffset + chartHeight - yPercent * chartHeight
    }

    ctx.moveTo(0, getYPosition(points[0].value))
    points.forEach((point: IDataPoint) => {
      ctx.lineTo(xPosition, getYPosition(point.value))
      xPosition += xStep
    })

    // ctx.bezierCurveTo(20, 100, 200, 100, 200, 20)
    ctx.strokeStyle = 'white'
    ctx.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ctx = canvas.getContext('2d')
    ctx.canvas.width  = canvasWidth
    ctx.canvas.height = canvasHeight
    draw(ctx)
  }, [points])

  return <canvas id={'west-canvas'} ref={canvasRef} />
})
