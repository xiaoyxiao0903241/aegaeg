import { useCallback, useEffect, useEffectEvent, useState } from 'react'

import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import { refetchStaleTabQueries } from '~/shared/api/query/invalidate'
import { HeroRaysBackground } from '~/shared/components/hero-rays-background'
import { InlineAlert } from '~/shared/components/inline-alert'
import { TableAuthActionProvider } from '~/shared/components/table'
import { scrollDappPanelsToTop } from '~/shared/lib/scroll-dapp-panels'
import { cn } from '~/shared/lib/utils'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { ExchangeSessionHosts } from '~/views/dapp/exchange/exchange-session-hosts'
import { GenesisSessionHost } from '~/views/dapp/genesis/genesis-session-host'
import { AppBar } from '~/views/dapp/host/app-bar'
import { GenesisPromoSync } from '~/views/dapp/host/genesis-promo-sync'
import { MobileNav } from '~/views/dapp/host/mobile-nav'
import {
  OnboardingGuide,
  useOnboardingAutoStart,
} from '~/views/dapp/host/onboarding/onboarding-guide'
import { RevealObserver, ScrollFadeHost } from '~/views/dapp/host/primitives'
import { Rail } from '~/views/dapp/host/rail'
import { useTabContentFade } from '~/views/dapp/host/use-tab-content-fade'
import { WalletConnectChip } from '~/views/dapp/host/wallet/wallet-connect-chip'
import { DockH5HeaderSlot } from '~/views/dapp/shared/dock-frame'
import { TabDetail, TabDock } from '~/views/dapp/tab-slots'
import { isThirdwebConfigured } from '~/web3/thirdweb'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useConnectWarmPrefetch } from '~/web3/wallet/use-connect-warm-prefetch'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/**
 * DApp 宿主窗口
 *
 * 组装左侧导航、顶部栏与左右两个内容面板（左侧操作区、右侧详情区），
 * 并托管移动端抽屉、新手指引、创世促销数据同步等全局行为。
 * 当前 Tab 存于 dapp-host-store，URL hash 变化与点击导航都会驱动它；
 * 切换 Tab 时先播放内容淡出，再替换面板，保持会话组件在透明层下重挂载。
 * hash 只由 store 的 writeTabHash 写入，避免再剥 `#tab/view` 深链。
 */
export function DappHost() {
  const { messages } = useI18n()
  const activeTab = useDappHostStore((state) => state.activeTab)
  const mobileNavOpen = useDappHostStore((state) => state.mobileNavOpen)
  const selectTab = useDappHostStore((state) => state.selectTab)
  const selectMobileTab = useDappHostStore((state) => state.selectMobileTab)
  const setMobileNavOpen = useDappHostStore((state) => state.setMobileNavOpen)
  const syncTabFromHash = useDappHostStore((state) => state.syncTabFromHash)
  const resetForeignSubviewStores = useDappHostStore((state) => state.resetForeignSubviewStores)
  const detailCollapsed = useDappHostStore((state) => state.detailCollapsed)
  const { sessionReady } = useAuth()
  const walletReady = hasWalletAccount(useActiveAccount())
  const [windowNode, setWindowNode] = useState<HTMLDivElement | null>(null)
  const { displayTab, phase } = useTabContentFade(activeTab)
  const onboarding = useOnboardingAutoStart()
  useConnectWarmPrefetch()
  const renderTableAuthAction = useCallback(() => <WalletConnectChip variant="primary" />, [])

  const onHashChange = useEffectEvent(() => {
    syncTabFromHash()
  })

  useEffect(() => {
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.title = messages.home.meta.title

    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', messages.home.meta.description)
    }
  }, [messages.home.meta.description, messages.home.meta.title])

  useEffect(() => {
    scrollDappPanelsToTop()
    refetchStaleTabQueries(displayTab)
    // 淡出结束后 displayTab 已切换，重置非当前页的子视图状态，保证淡出期间旧视图稳定
    resetForeignSubviewStores(displayTab)
  }, [displayTab, resetForeignSubviewStores])

  return (
    <main
      className={cn(
        'relative flex h-dvh flex-col gap-0 overflow-hidden bg-background pt-0 text-muted-foreground',
        'max-dapp:bg-transparent',
      )}
    >
      {/* H5：桃色渐变底色固定铺满视口，不随滚动卡片移动。 */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed inset-0 z-0',
          'hidden max-dapp:block',
          'bg-[linear-gradient(180deg,var(--dapp-h5-gradient-top)_0%,var(--background)_25%,var(--background)_100%)]',
        )}
      />
      <HeroRaysBackground variant="host" />
      <AppBar onStartOnboarding={onboarding.startTour} onboardingDone={onboarding.done} />
      <OnboardingGuide onOpenChange={onboarding.setOpen} open={onboarding.open} />

      {import.meta.env.DEV && !isThirdwebConfigured ? (
        <InlineAlert
          as="div"
          density="comfortable"
          role="status"
          className="relative z-1 mx-4 mb-2"
        >
          未配置 <code className="font-mono">VITE_THIRDWEB_CLIENT_ID</code>
          ，钱包连接会 401。请复制 <code className="font-mono">.env.example</code> 为{' '}
          <code className="font-mono">.env</code>，填入 thirdweb Dashboard 的 Client ID 后重启{' '}
          <code className="font-mono">pnpm dev</code>。
        </InlineAlert>
      ) : null}

      <section
        className={cn(
          'relative z-1 flex min-h-0 flex-1 flex-col overflow-hidden px-0',
          'dapp:items-center dapp:justify-stretch dapp:overflow-visible dapp:pb-4',
        )}
        aria-label="AEGIS X DApp"
      >
        <div
          className={cn(
            'relative z-1 mx-auto flex size-full min-h-0 flex-1 flex-col',
            'dapp:max-w-none dapp:items-center dapp:px-0',
            'max-dapp:max-w-none max-dapp:px-0',
          )}
          data-dapp-host-container
        >
          <TableAuthActionProvider renderAction={renderTableAuthAction}>
            <GenesisPromoSync />
            <GenesisSessionHost active={displayTab === 'genesis'}>
              {(genesis) => (
                <ExchangeSessionHosts activeTab={displayTab}>
                  {({ trade, flash, burn, turbine }) => (
                    <div
                      ref={setWindowNode}
                      className={cn(
                        'group/host relative z-1 mx-auto grid min-h-0 w-full border border-border bg-card shadow-window',
                        'rounded-xl dapp:h-full dapp:max-h-full dapp:max-w-none dapp:overflow-hidden',
                        !sessionReady && 'shadow-window-compact',
                        'max-dapp:flex max-dapp:h-full max-dapp:max-h-full max-dapp:min-h-0 max-dapp:max-w-none max-dapp:flex-1 max-dapp:flex-col',
                        'max-dapp:overflow-hidden max-dapp:rounded-t-2xl max-dapp:rounded-b-none max-dapp:border-0 max-dapp:shadow-card',
                      )}
                      data-collapsed={detailCollapsed ? 'true' : 'false'}
                      data-session-ready={sessionReady ? 'true' : 'false'}
                      data-dapp-window
                      data-tab={displayTab}
                      data-wallet-ready={walletReady ? 'true' : 'false'}
                    >
                      {/* H5：圆角裁切与纵向滚动拆开，避免部分浏览器在圆角处露出黑底 */}
                      <div
                        className={cn(
                          'dapp:contents',
                          'max-dapp:flex max-dapp:h-full max-dapp:min-h-0 max-dapp:flex-1 max-dapp:flex-col max-dapp:gap-3',
                          'max-dapp:overflow-x-hidden max-dapp:overflow-y-auto',
                          'max-dapp:px-4.5 max-dapp:pt-0 max-dapp:pb-8',
                        )}
                        data-dapp-window-scroll
                      >
                        <Rail activeTab={activeTab} onSelectTab={selectTab} />

                        <DockH5HeaderSlot />

                        <aside
                          className={cn(
                            'dapp-content-fade border-r border-border bg-card',
                            'dapp:flex dapp:h-full dapp:max-h-full dapp:min-h-0 dapp:flex-col dapp:overflow-hidden',
                            'max-dapp:h-auto max-dapp:max-h-none max-dapp:min-h-0 max-dapp:w-full max-dapp:shrink-0 max-dapp:overflow-visible max-dapp:border-r-0 max-dapp:border-b-0',
                          )}
                          data-dapp-widget-panel
                          data-phase={phase}
                        >
                          <MobileNav
                            activeTab={activeTab}
                            onClose={() => setMobileNavOpen(false)}
                            onSelectTab={selectMobileTab}
                            open={mobileNavOpen}
                          />
                          <TabDock
                            activeTab={displayTab}
                            burn={burn}
                            flash={flash}
                            genesis={genesis}
                            onSelectTab={selectTab}
                            trade={trade}
                            turbine={turbine}
                          />
                        </aside>

                        <ScrollFadeHost
                          className={cn(
                            'max-dapp:contents',
                            detailCollapsed ? 'dapp:pointer-events-none' : undefined,
                          )}
                        >
                          <section
                            className={cn(
                              'dapp-content-fade min-w-0 overflow-x-hidden bg-card',
                              'dapp:max-h-full dapp:min-h-0',
                              detailCollapsed
                                ? 'pointer-events-none overflow-y-hidden opacity-0'
                                : 'dapp:overflow-y-auto',
                              'max-dapp:pointer-events-auto max-dapp:h-auto max-dapp:max-h-none max-dapp:min-h-0 max-dapp:w-full max-dapp:shrink-0 max-dapp:overflow-visible',
                            )}
                            aria-hidden={detailCollapsed}
                            aria-labelledby={`${displayTab}-title`}
                            data-dapp-detail
                            data-phase={detailCollapsed ? 'idle' : phase}
                          >
                            <TabDetail
                              activeTab={displayTab}
                              burn={burn}
                              flash={flash}
                              genesis={genesis}
                              trade={trade}
                              turbine={turbine}
                            />
                          </section>
                        </ScrollFadeHost>
                      </div>
                    </div>
                  )}
                </ExchangeSessionHosts>
              )}
            </GenesisSessionHost>
          </TableAuthActionProvider>
        </div>
      </section>

      <RevealObserver container={windowNode} />
    </main>
  )
}
