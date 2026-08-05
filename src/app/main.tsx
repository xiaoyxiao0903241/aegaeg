/**
 * DApp 入口
 *
 * 先执行启动副作用，再挂载 React 根节点；
 * 组装顺序为国际化 → 全局 Provider → 错误边界 → 主外壳。
 */
import { bootDappApp } from '~/app/startup/dapp-boot'

bootDappApp()

import '~/shared/styles/app.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AppShell } from '~/app/app-shell'
import { WebRootProviders } from '~/app/startup/web-root-providers'
import { I18nProvider } from '~/i18n/i18n-provider'
import { AppToaster } from '~/shared/components/app-toaster'
import { LocalizedErrorBoundary } from '~/shared/components/error-boundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <WebRootProviders>
        <LocalizedErrorBoundary name="dapp">
          <AppShell />
        </LocalizedErrorBoundary>
        <AppToaster />
      </WebRootProviders>
    </I18nProvider>
  </StrictMode>,
)
