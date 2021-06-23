import { createGlobalStyle } from 'styled-components'
import './fonts.css'

const StyleGlobal = createGlobalStyle`
  html {
    box-sizing: border-box;
    background: #7F7FD5;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
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
      display: none;
    }
    body {
      background: url('poster.jpg');
      background-size: cover;
    }
  }
`

export default StyleGlobal
