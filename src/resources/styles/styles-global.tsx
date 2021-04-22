import { createGlobalStyle } from 'styled-components'
import './fonts.css'

const StyleGlobal = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-size: 13px;
    color: #0a0606;
    font-family: Cairo, Helvetica, Arial, sans-serif;
    font-variant: normal;
    background: #E6E6E6;
  }

  html, body, #root {
    height: 100%;
  }
`

export default StyleGlobal
