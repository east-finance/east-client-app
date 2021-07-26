import React, { useLayoutEffect, useState } from 'react'
import { throttle } from '../utils'

function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize() {
      setSize([document.documentElement.clientWidth, document.documentElement.clientHeight])
    }
    window.addEventListener('resize', throttle(updateSize, 100))
    updateSize()
    return () => {
      window.removeEventListener('resize', throttle(updateSize, 100))
    }
  }, [])
  return size
}

export default useWindowSize
