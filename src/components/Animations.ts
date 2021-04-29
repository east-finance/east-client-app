import { keyframes } from 'styled-components'

export const fadeInControls = keyframes`
  from {
    transform: translateY(150%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1
  }
`

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

export const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.5);
  }
`

export const blurIn = keyframes`
  from {
    filter: blur(0);
    transform: scale(1)
  }
  to {
    filter: blur(12px);
    transform: scale(0.9)
  }
`

export const blurOut = keyframes`
  from {
    filter: blur(12px);
    transform: scale(0.9)
  }
  to {
    filter: blur(0);
    transform: scale(1)
  }
`

// Уход вверх первого попапа
export const circOutY = keyframes`
  from {
    transform: translateY(0)
  }
  to {
    transform: translateY(-450px)
  }
`
// Обратная анимация
export const circInY = keyframes`
  from {
    transform: translateY(-450px)
  }
  to {
    transform: translateY(0)
  }
`
// Уход вправо
export const circOutX = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(150px);
  }
`
// Уход влево
export const circInX = keyframes`
  from {
    transform: translateX(150px);
  }
  to {
    transform: translateX(0);
  }
`
