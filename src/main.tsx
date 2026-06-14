import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThirdwebProvider } from 'thirdweb/react'
import { Toaster } from 'sonner'
import { App } from './app'
import { I18nProvider } from './i18n/i18n-provider'
import './i18n/config'
import './styles/dapp.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <ThirdwebProvider>
        <App />
        <Toaster position="bottom-center" />
      </ThirdwebProvider>
    </I18nProvider>
  </StrictMode>,
)
