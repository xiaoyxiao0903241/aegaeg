import { suppressKnownConsoleNoise } from '~/lib/suppress-known-console-noise'

suppressKnownConsoleNoise()

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('site-fluid', 'dapp-app')
}

import { StrictMode, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AppToaster } from '~/components/app-toaster'
import { DappShell } from '~/app/dapp-shell'
import { I18nProvider } from '~/i18n/i18n-provider'
import { WebRootProviders } from '~/providers/web-root-providers'
import {
  bindPageScrollPersistence,
  restorePersistedPageScroll,
} from '~/lib/page-scroll-restoration'
import '~/i18n/config'
import '~/styles/dapp.css'

const DAPP_SCROLL_KEY = 'aegis.dapp.scroll'

bindPageScrollPersistence(DAPP_SCROLL_KEY)

function DappApp() {
  useLayoutEffect(() => {
    restorePersistedPageScroll(DAPP_SCROLL_KEY)
  }, [])

  return (
    <>
      <DappShell />
      <AppToaster />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <WebRootProviders>
        <DappApp />
      </WebRootProviders>
    </I18nProvider>
  </StrictMode>,
)
