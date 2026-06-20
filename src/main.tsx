import { suppressKnownConsoleNoise } from '~/lib/suppress-known-console-noise'

suppressKnownConsoleNoise()

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('site-fluid', 'dapp-app')
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { DappShell } from '~/app/dapp-shell'
import { I18nProvider } from '~/i18n/i18n-provider'
import { WebRootProviders } from '~/providers/web-root-providers'
import '~/i18n/config'
import '~/styles/dapp.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <WebRootProviders>
        <DappShell />
        <Toaster position="bottom-center" />
      </WebRootProviders>
    </I18nProvider>
  </StrictMode>,
)
