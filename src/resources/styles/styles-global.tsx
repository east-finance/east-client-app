import { createGlobalStyle } from 'styled-components'
import './fonts.css'

const StyleGlobal = createGlobalStyle`
  html {
    box-sizing: border-box;
    background: #f4f4f4;
    
    @media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
      transform: rotate(-90deg);
      transform-origin: left top;
      width: 100vh;
      height: 100vw;
      overflow-x: hidden;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
  
  body {
    margin: 0;
    padding: 0;
    font-size: 13px;
    color: #043569;;
    font-family: Cairo, Helvetica, Arial, sans-serif;
    font-variant: normal;
  }
  
  //html, body {
  //  width:100vw;
  //  height: 100vh;
  //  margin: 0;
  //}

  a {
    color: #2e8ad7;
    text-decoration: none;
  }

  @media (max-width: 767px) {
    #videoBG {
      // display: none;
    }
    body {
    }
  }
`

export default StyleGlobal
