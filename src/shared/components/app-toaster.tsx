import type { CSSProperties } from 'react'
import { Toaster } from 'sonner'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'

/** `--width` 限制提示最大宽度：短文案保持胶囊形，长文案自动换行 */
const toastMaxWidth = 'min(23.75rem, calc(100vw - 2rem))'
/** 大圆角营造单行胶囊感；不做全圆 */
const toastRadius = '2rem'

const toasterStyle = {
  '--gap': '0.875rem',
  '--width': toastMaxWidth,
  '--border-radius': toastRadius,
  '--normal-bg': 'var(--toaster-bg)',
  '--normal-border': 'var(--toaster-border)',
  '--normal-text': 'var(--toaster-text)',
} as CSSProperties

const toastStyle = {
  width: 'max-content',
  maxWidth: toastMaxWidth,
} as CSSProperties

/**
 * 全局提示容器
 *
 * 挂载在应用根部，统一 toast 样式与位置：
 * 移动端底部居中，桌面端顶部居中。
 */
export function AppToaster() {
  const isMobile = useMobileViewport()

  return (
    <Toaster
      className="app-toaster"
      position={isMobile ? 'bottom-center' : 'top-center'}
      richColors={false}
      style={toasterStyle}
      theme="dark"
      toastOptions={{ style: toastStyle }}
    />
  )
}
