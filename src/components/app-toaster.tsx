import { Toaster } from 'sonner'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

export function AppToaster() {
  const isMobile = useMobileViewport()

  return (
    <Toaster
      position={isMobile ? 'bottom-center' : 'top-center'}
      richColors={false}
    />
  )
}
