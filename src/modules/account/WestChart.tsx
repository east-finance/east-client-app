import React from 'react'
import useStores from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import moment from 'moment'
import { LineChart, Line, Tooltip, TooltipProps } from 'recharts'
import styled from 'styled-components'
import { roundNumber } from '../../utils'
import useWindowSize from '../../hooks/useWindowSize'
import { Block } from '../../components/Block'
import { IOracleValue } from '../../interfaces'

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
  letter-spacing: 1px;
`

const TooltipTimestamp = styled(TooltipValue)`
  font-size: 11px;
  opacity: 0.7;
`

const CustomTooltip = (props: TooltipProps<any, any> & { chartData: IOracleValue[] }) => {
  const { chartData } = props
  if (props.active && props.payload && props.payload.length) {
    const { value, timestamp } = props.payload[0].payload
    let isLastItem = false
    if (chartData && chartData.length > 0) {
      const lastItem = chartData[chartData.length - 1]
      isLastItem = lastItem.value === value && lastItem.timestamp === timestamp
    }
    const customStyle: any = {}
    if (isLastItem) {
      customStyle.marginLeft = '-90px'
    }
    return <TooltipContainer style={customStyle}>
      <TooltipValue>{value}</TooltipValue>
      <Block marginTop={4}>
        <TooltipTimestamp>
          {moment(timestamp).format('MMMM D, HH:mm')}
        </TooltipTimestamp>
      </Block>
    </TooltipContainer>
  }
  return null
}

const getMinMax = (points: IOracleValue[]) => {
  let min = 0
  let max = 0
  if (points.length > 0) {
    const sorted = [...points].sort((a, b) => +a.value - +b.value)
    min = +sorted[0].value
    max = +sorted[sorted.length - 1].value
  }
  return { min, max }
}

const RelativeValueProp = 'relativeValue'

export const WestChart = observer( () => {
  const { dataStore } = useStores()
  const [ canvasWidth ] = useWindowSize()

  const { min, max } = getMinMax(dataStore.westRatesHistory)

  const chartData = toJS(dataStore.westRatesHistory).reverse().map(item => {
    const { value } = item
    return {
      ...item,
      value: roundNumber(value),
      [RelativeValueProp]: ((+value - min) / (max - min))
    }
  })

  return <Container>
    <LineChart width={canvasWidth} height={45} data={chartData}>
      <Line
        type="monotone"
        dataKey={RelativeValueProp}
        stroke="#FFFFFF"
        strokeWidth={2}
        dot={false}
        activeDot={false}
      />
      <Tooltip
        content={<CustomTooltip chartData={chartData} />}
        offset={-45}
        wrapperStyle={{ marginTop: '45px' }}
        // cursor={<CustomCursor />}
      />
    </LineChart>
    <WestPriceContainer>
      <div>${roundNumber(dataStore.westRate)}</div>
      <div>west</div>
    </WestPriceContainer>
  </Container>
})
