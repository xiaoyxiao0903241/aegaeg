import { useEffect, useState } from 'react'

import { MOBILE_MAX_WIDTH_QUERY } from '~/shared/config/breakpoints'

/**
 * 是否处于移动端视口
 *
 * 初始值在首次渲染时由 matchMedia 计算，随后监听断点变化实时更新。
 *
 * @returns 当前是否为移动端视口
 */
export function useMobileViewport() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches,
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
