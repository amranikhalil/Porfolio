import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resets window scroll to top on every route change so navigating to a
// project detail page does not inherit the previous scroll position.
export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
