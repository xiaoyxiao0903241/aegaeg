import { useEffect, useState } from 'react'
import { MOBILE_MAX_WIDTH_QUERY } from '~/lib/breakpoints'

export { MOBILE_MAX_WIDTH_QUERY } from '~/lib/breakpoints'

export function useMobileViewport() {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MAX_WIDTH_QUERY)
    const handleChange = () => setIsMobile(media.matches)
    handleChange()
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
