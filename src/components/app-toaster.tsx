import type { CSSProperties } from 'react'
import { Toaster } from 'sonner'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

/** `--width` caps toast max width; body hugs content (sonner #678). */
const toastMaxWidth = 'min(23.75rem, calc(100vw - 2rem))'

const toasterStyle = {
  '--gap': '0.875rem',
  '--width': toastMaxWidth,
  '--border-radius': '9999px',
  '--normal-bg': 'oklch(0% 0 0)',
  '--normal-border': 'oklch(100% 0 0 / 12%)',
  '--normal-text': 'oklch(100% 0 0)',
} as CSSProperties

const toastStyle = {
  width: 'max-content',
  maxWidth: toastMaxWidth,
  minWidth: 'max-content',
} as CSSProperties

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
