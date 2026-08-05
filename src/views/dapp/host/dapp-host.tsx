import { useEffect, useState } from 'react'

import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { refetchStaleTabQueries } from '~/shared/api/query/invalidate'
import { HeroRaysBackground } from '~/shared/components/hero-rays-background'
import { Icon } from '~/shared/components/icon'
import { InlineAlert } from '~/shared/components/inline-alert'
import { dappAssets } from '~/shared/config/assets'
import { cn } from '~/shared/lib/utils'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { ExchangeSessionHosts } from '~/views/dapp/exchange/exchange-session-hosts'
import { GenesisSessionHost } from '~/views/dapp/genesis/genesis-session-host'
import { useTabContentFade } from '~/views/dapp/host/content-fade'
import { GenesisPromoSync } from '~/views/dapp/host/genesis-promo-sync'
import { MobileNav } from '~/views/dapp/host/mobile-nav'
import {
  OnboardingGuide,
  useOnboardingAutoStart,
} from '~/views/dapp/host/onboarding/onboarding-guide'
import { Rail } from '~/views/dapp/host/rail'
import { RevealObserver } from '~/views/dapp/host/reveal-observer'
import { ScrollFadeHost } from '~/views/dapp/host/scroll-fade-host'
import { Topbar } from '~/views/dapp/host/topbar'
import { scrollDappPanelsToTop } from '~/views/dapp/host/utils'
import { TabDetail, TabDock } from '~/views/dapp/tab-slots'
import { isThirdwebConfigured } from '~/web3/thirdweb'
import { useConnectWarmPrefetch } from '~/web3/wallet/use-connect-warm-prefetch'

function replaceTabHash(tab: string) {
  window.history.replaceState(null, '', `#${tab}`)
}

/**
 * DApp 宿主窗口
 *
 * 组装左侧导航、顶部栏与左右两个内容面板（左侧操作区、右侧详情区），
 * 并托管移动端抽屉、新手指引、创世促销数据同步等全局行为。
 * 当前 Tab 存于 dapp-host-store，URL hash 变化与点击导航都会驱动它；
 * 切换 Tab 时先播放内容淡出，再替换面板，保持会话组件在透明层下重挂载。
 */
export function DappHost() {
  const { messages } = useI18n()
  const activeTab = useDappHostStore((state) => state.activeTab)
  const mobileNavOpen = useDappHostStore((state) => state.mobileNavOpen)
  const selectTabInStore = useDappHostStore((state) => state.selectTab)
  const selectMobileTabInStore = useDappHostStore((state) => state.selectMobileTab)
  const setMobileNavOpen = useDappHostStore((state) => state.setMobileNavOpen)
  const syncTabFromHash = useDappHostStore((state) => state.syncTabFromHash)
  const resetForeignSubviewStores = useDappHostStore((state) => state.resetForeignSubviewStores)
  const hostState = useDappHost()
  const [windowNode, setWindowNode] = useState<HTMLDivElement | null>(null)
  const { displayTab, phase } = useTabContentFade(activeTab)
  const onboarding = useOnboardingAutoStart()
  useConnectWarmPrefetch()

  const selectTab = (tab: typeof activeTab) => {
    selectTabInStore(tab)
    replaceTabHash(tab)
  }
  const selectMobileTab = (tab: typeof activeTab) => {
    selectMobileTabInStore(tab)
    replaceTabHash(tab)
  }

  useEffect(() => {
    syncTabFromHash()
    window.addEventListener('hashchange', syncTabFromHash)
    return () => window.removeEventListener('hashchange', syncTabFromHash)
  }, [syncTabFromHash])

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

  // 复刻原先状态仓库里的滚动行为：兑换子视图切换开始时把面板滚回顶部
  useEffect(() => {
    let prevView = useExchangeViewStore.getState().view
    let prevMotion = useExchangeViewStore.getState().motion
    return useExchangeViewStore.subscribe((state) => {
      if (state.motion && !prevMotion && state.view !== prevView) {
        scrollDappPanelsToTop()
      }
      prevView = state.view
      prevMotion = state.motion
    })
  }, [])

  const mobileNavId = 'dapp-mobile-nav'
  const effectiveDetailCollapsed = hostState.detailCollapsed

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
      <Topbar onStartOnboarding={onboarding.startTour} onboardingDone={onboarding.done} />
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
                      !hostState.sessionReady && 'shadow-window-compact',
                      'max-dapp:flex max-dapp:h-full max-dapp:max-h-full max-dapp:min-h-0 max-dapp:max-w-none max-dapp:flex-1 max-dapp:flex-col max-dapp:gap-3',
                      'max-dapp:overflow-x-hidden max-dapp:overflow-y-auto max-dapp:rounded-t-2xl max-dapp:rounded-b-none max-dapp:border-0',
                      'max-dapp:px-4.5 max-dapp:pt-4.5 max-dapp:pb-8 max-dapp:shadow-card',
                    )}
                    data-collapsed={effectiveDetailCollapsed ? 'true' : 'false'}
                    data-session-ready={hostState.sessionReady ? 'true' : 'false'}
                    data-dapp-window
                    data-tab={displayTab}
                    data-wallet-ready={hostState.walletReady ? 'true' : 'false'}
                  >
                    <Rail activeTab={activeTab} onSelectTab={selectTab} />

                    <ScrollFadeHost>
                      <aside
                        className={cn(
                          'dapp-content-fade overflow-x-hidden border-r border-border bg-card px-6 pt-10 pb-5.5',
                          // PC：占满列高，面板内部滚动
                          'dapp:h-full dapp:max-h-full dapp:min-h-0 dapp:overflow-y-auto',
                          // H5：按内容定高，由外层窗口统一滚动（避免 flex-shrink 重叠）
                          'max-dapp:h-auto max-dapp:max-h-none max-dapp:min-h-0 max-dapp:w-full max-dapp:shrink-0 max-dapp:overflow-visible max-dapp:border-r-0 max-dapp:border-b-0 max-dapp:p-0',
                        )}
                        data-dapp-widget-panel
                        data-phase={phase}
                      >
                        <div className="relative hidden max-dapp:block" data-dapp-h5-menu>
                          <button
                            aria-controls={mobileNavId}
                            aria-expanded={mobileNavOpen}
                            aria-label={messages.topbar.openMenu}
                            className="grid aspect-square w-10 cursor-pointer list-none place-items-center rounded-md border border-border bg-card"
                            onClick={() => setMobileNavOpen(true)}
                            type="button"
                          >
                            <Icon alt="" size="lg" src={dappAssets.menu} />
                          </button>
                        </div>
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
                    </ScrollFadeHost>

                    <ScrollFadeHost
                      className={effectiveDetailCollapsed ? 'dapp:pointer-events-none' : undefined}
                    >
                      <section
                        className={cn(
                          'dapp-content-fade min-w-0 overflow-x-hidden bg-card',
                          // PC：占满列高，面板内部滚动
                          'dapp:max-h-full dapp:min-h-0',
                          effectiveDetailCollapsed
                            ? 'pointer-events-none overflow-y-hidden opacity-0'
                            : 'dapp:overflow-y-auto',
                          // H5：按内容定高，置于共享窗口滚动器下方
                          'max-dapp:pointer-events-auto max-dapp:h-auto max-dapp:max-h-none max-dapp:min-h-0 max-dapp:w-full max-dapp:shrink-0 max-dapp:overflow-visible',
                        )}
                        aria-hidden={effectiveDetailCollapsed}
                        aria-labelledby={`${displayTab}-title`}
                        data-dapp-detail
                        data-phase={effectiveDetailCollapsed ? 'idle' : phase}
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
                )}
              </ExchangeSessionHosts>
            )}
          </GenesisSessionHost>
        </div>
      </section>

      <RevealObserver container={windowNode} />
    </main>
  )
}
