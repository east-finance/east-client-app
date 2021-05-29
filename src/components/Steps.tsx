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
`

const StepContainer = styled.div<{ isActive: boolean; isPassed: boolean; }>`
  display: inline-block;
  background: #D1D1D1;
  color: white;
  border-radius: 28px;
  padding: 8px 12px;
  opacity: ${props => props.isPassed ? 0.6 : 1};

  ${({ isActive, isPassed }) => (isActive || isPassed) && `
    background: radial-gradient(204.55% 3032.86% at 67.55% 85.45%, rgba(172, 171, 216, 0) 0%, #514EFF 100%), #1D87D6;
  `}
`

const StepsLink = styled.div<{ isActive: boolean; isPassed: boolean; }>`
  width: 24px;
  height: 2px;
  display: inline-block;
  background: #D1D1D1;

  ${({ isPassed, isActive }) => (isPassed || isActive) && `
    background: radial-gradient(204.55% 3032.86% at 67.55% 85.45%, rgba(172, 171, 216, 0) 0%, #514EFF 100%), #1D87D6;
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
