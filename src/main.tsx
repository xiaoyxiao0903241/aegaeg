import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AutoConnect, ThirdwebProvider } from 'thirdweb/react'
import { Toaster } from 'sonner'
import { App } from './app'
import { I18nProvider } from './i18n/i18n-provider'
import { thirdwebClient } from './web3/thirdweb'
import './i18n/config'
import './styles/dapp.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <ThirdwebProvider>
        <AutoConnect client={thirdwebClient} timeout={15_000} />
        <App />
        <Toaster position="bottom-center" />
      </ThirdwebProvider>
    </I18nProvider>
  </StrictMode>,
)
