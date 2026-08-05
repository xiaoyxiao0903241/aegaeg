/**
 * 首页客户端入口
 *
 * 模块加载时先执行应用引导与旧浏览器垫片（bootHomeApp），
 * 随后挂载 React 根组件；挂载后恢复滚动位置并启动首页动效。
 */
import { bootHomeApp, restoreHomeScroll } from '~/app/startup/home-boot'

bootHomeApp()

import '~/shared/styles/home.css'

import { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { HomeProviders } from '~/app/startup/home-providers'
import { I18nProvider } from '~/i18n/i18n-provider'
import { LocalizedErrorBoundary } from '~/shared/components/error-boundary'
import { HomePage } from '~/views/home/home-page'
import { bootHomeReveal } from '~/views/home/home-reveal-loader'

function HomeApp() {
  useLayoutEffect(() => {
    restoreHomeScroll()
    bootHomeReveal()
  }, [])

  return <HomePage />
}

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <HomeProviders>
      <LocalizedErrorBoundary name="home">
        <HomeApp />
      </LocalizedErrorBoundary>
    </HomeProviders>
  </I18nProvider>,
)
