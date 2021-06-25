import styled from 'styled-components'
import BgWater from '../resources/images/bg-water.mp4'
import React, { useRef } from 'react'
import { useEffect } from 'react'

// https://redstapler.co/responsive-css-video-background/

const VideoContainer = styled.video<{ isBlurred: boolean }>`
  position: fixed;
  top: 0;
  z-index: -1;
  transition: filter 1200ms ease;
  
  filter: blur(${props => props.isBlurred ? '12' : '0'}px);

  @media (min-aspect-ratio: 16/9) {
    width:100%;
    height: auto;
  }

  @media (max-aspect-ratio: 16/9) {
    width:auto;
    height: 100%;
  }
`

interface IProps {
  isBlurred: boolean;
}

export const BackgroundVideo = (props: IProps) => {
  // const videoRef: any = useRef(null)
  // useEffect(() => {
  //   if (videoRef && videoRef.current) {
  //     videoRef.current.playbackRate = 0.5
  //   }
  // }, [])
  return <VideoContainer id={'videoBG'} autoPlay muted loop {...props}>
    <source src={BgWater} type="video/mp4" />
  </VideoContainer>
}
