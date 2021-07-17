import React, { useState } from 'react'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import moment from 'moment'
import { LineChart, Line, Tooltip } from 'recharts'
import styled from 'styled-components'
import { roundNumber } from '../../utils'
import CursorImg from '../../resources/images/cursor-pointer.png'
import useWindowSize from '../../hooks/useWindowSize'

const Container = styled.div`
  position: relative;
`

const  WestPriceContainer = styled.div`
  position: absolute;
  right: 16px;
  top: 45px;
  text-align: right;
  font-family: Cairo;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #FFFFFF;
`

const TooltipContainer = styled.div`
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 54px;
  padding: 16px 24px;
`

const TooltipValue = styled.div`
  font-family: Staatliches;
  font-size: 13px;
  line-height: 16px;
  color: #0A0606;
`

const TooltipTimestamp = styled(TooltipValue)`
    font-size: 11px;
    opacity: 0.7;
`

const CustomTooltip = (props: any) => {
  if (props.active && props.payload && props.payload.length) {
    const { value, timestamp } = props.payload[0].payload
    return <TooltipContainer>
      <TooltipValue>{value}</TooltipValue>
      <TooltipTimestamp>{moment(timestamp).format('MM MMM, hh:mm')}</TooltipTimestamp>
    </TooltipContainer>
  }
  return null
}

const CustomCursor = styled.div`
  width: 64px;
  height: 55px;
  background-image: url(${CursorImg});
  background-size: 100% 100%;
  cursor: pointer;
`

export const WestChart = observer( () => {
  const { dataStore } = useStores()
  const [canvasWidth] = useWindowSize()

  const chartData = toJS(dataStore.westRatesHistory).reverse()

  return <Container>
    <LineChart width={canvasWidth} height={45} data={chartData}>
      <Line type="monotone" dataKey="value" stroke="#FFFFFF" strokeWidth={2} />
      <Tooltip
        content={CustomTooltip}
        offset={-45}
        wrapperStyle={{ marginTop: '45px' }}
        // cursor={<CustomCursor />}
      />
    </LineChart>
    <WestPriceContainer>
      <div>${roundNumber(dataStore.westRate, 4)}</div>
      <div>west</div>
    </WestPriceContainer>
  </Container>
})
