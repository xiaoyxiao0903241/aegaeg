import type { CSSProperties } from 'react'
import { Toaster } from 'sonner'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

/** Sonner defaults are px — rem + CSS vars so toast scales with `site-fluid` root font-size. */
const toasterStyle = {
  '--gap': '0.875rem',
  '--width': 'min(23.75rem, calc(100vw - 2rem))',
  '--border-radius': '9999px',
  '--normal-bg': 'oklch(0% 0 0)',
  '--normal-border': 'oklch(100% 0 0 / 12%)',
  '--normal-text': 'oklch(100% 0 0)',
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
    />
  )
}
