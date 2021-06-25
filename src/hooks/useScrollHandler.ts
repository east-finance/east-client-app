import { useEffect } from 'react'

function useScrollHandler(ref: any, callback: any) {
  useEffect(() => {
    function handleScroll(event: any) {
      if (ref.current && ref.current.contains(event.target)) {
        callback(event.currentTarget.scrollLeft)
      }
    }

    // Bind the event listener
    ref.current.addEventListener('scroll', handleScroll)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('scroll', handleScroll)
    }
  }, [ref])
}

export default useScrollHandler
