import { bootDappApp } from '~/app/bootstrap/dapp-boot'

bootDappApp()

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppToaster } from '~/shared/ui/app-toaster'
import { DappShell } from '~/app/dapp-shell'
import { I18nProvider } from '~/i18n/i18n-provider'
import { WebRootProviders } from '~/app/bootstrap/web-root-providers'
import { ErrorBoundary } from '~/shared/ui/error-boundary'
import '~/i18n/config'
import '~/shared/styles/app.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <WebRootProviders>
        <ErrorBoundary name="dapp">
          <DappShell />
        </ErrorBoundary>
        <AppToaster />
      </WebRootProviders>
    </I18nProvider>
  </StrictMode>,
)
