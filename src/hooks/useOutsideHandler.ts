import { useEffect } from 'react'

function useOutsideAlerter(ref: any, onClickOutside: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      const notificationContainer = document.getElementById('toast-container')
      if (ref.current && !ref.current.contains(event.target) && !(notificationContainer && notificationContainer.contains(event.target))) {
        onClickOutside(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}

export default useOutsideAlerter
