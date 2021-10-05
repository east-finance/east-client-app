import styled from 'styled-components'
import BgWater from '../resources/images/east-nosoundloss.mp4'
import React from 'react'

// https://redstapler.co/responsive-css-video-background/

const VideoContainer = styled.video`
  position: fixed;
  top: 0;
  z-index: -1;
  background-color: #4888ae;

  @media (min-aspect-ratio: 16/9) {
    width:100%;
    height: auto;
  }

  @media (max-aspect-ratio: 16/9) {
    width:auto;
    height: 100%;
  }
`

const StaticBackground = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: #4888ae;
`

export const BackgroundVideo = () => {
  // const videoRef: any = useRef(null)
  // useEffect(() => {
  //   if (videoRef && videoRef.current) {
  //     videoRef.current.playbackRate = 0.5
  //   }
  // }, [])
  const isSafari = navigator.vendor.match(/apple/i) &&
    !navigator.userAgent.match(/crios/i) &&
    !navigator.userAgent.match(/fxios/i) &&
    !navigator.userAgent.match(/Opera|OPT\//)
  if (isSafari) {
    return <StaticBackground />
  }
  return <VideoContainer id={'videoBG'} autoPlay muted loop playsInline={true}>
    <source src={BgWater} type="video/mp4" />
  </VideoContainer>
}
