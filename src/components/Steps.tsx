import React from 'react'
import styled from 'styled-components'

export interface IStep {
  text: string;
}

export interface IProps {
  steps: IStep[];
  currentStepIndex: number;
}

const Container = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
`

const StepContainer = styled.div<{ isActive: boolean; isPassed: boolean; }>`
  display: inline-block;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 28px;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 16px;

  ${({ isActive, isPassed }) => (isActive || isPassed) && `
    background-image: linear-gradient(to right, #545ff5 0%, #3b8ad9 51%, #4687dc 100%);
    color: #FFFFFF;
  `}
`

const StepsLink = styled.div<{ isActive: boolean; isPassed: boolean; }>`
  width: 24px;
  height: 2px;
  display: inline-block;
  background: rgba(255, 255, 255, 0.3);

  ${({ isPassed, isActive }) => (isPassed || isActive) && `
    background: #1D87D6;
  `}
`

const StepWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Step = (props: { step: IStep; isActive: boolean; isPassed: boolean }) => {
  return <StepContainer isActive={props.isActive} isPassed={props.isPassed}>
    {props.step.text}
  </StepContainer>
}

export const Steps = (props: IProps) => {
  const { steps, currentStepIndex } = props
  return <Container>
    {props.steps.map((step, index) => {
      const isActive = currentStepIndex === index
      const isPassed = currentStepIndex > index
      return <StepWrapper key={index}>
        {index > 0 && index <= steps.length - 1 &&
          <StepsLink isPassed={isPassed} isActive={isActive} />
        }
        <Step step={step} isPassed={isPassed} isActive={isActive} />
      </StepWrapper>
    }
    )}
  </Container>
}
