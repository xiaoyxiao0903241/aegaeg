import type { CSSProperties } from 'react'
import { Toaster } from 'sonner'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

/** `--width` caps toast max width; short copy stays content-fit capsule, long copy wraps. */
const toastMaxWidth = 'min(23.75rem, calc(100vw - 2rem))'
/** Large enough for single-line capsule feel; not rounded-full. */
const toastRadius = '2rem'

const toasterStyle = {
  '--gap': '0.875rem',
  '--width': toastMaxWidth,
  '--border-radius': toastRadius,
  '--normal-bg': 'oklch(0% 0 0)',
  '--normal-border': 'oklch(100% 0 0 / 12%)',
  '--normal-text': 'oklch(100% 0 0)',
} as CSSProperties

const toastStyle = {
  width: 'max-content',
  maxWidth: toastMaxWidth,
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
