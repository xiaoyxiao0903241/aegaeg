import { useEffect, useState } from 'react'
import { cn } from '~/shared/lib/utils'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { useI18n } from '~/i18n/use-i18n'
import { DappIcon } from '~/app/shell/dapp-icon'
import { dappAssets } from '~/app/assets'
import { DappRail } from '~/app/dapp-rail'
import { DappMobileNav } from '~/app/shell/dapp-mobile-nav'
import { DappRevealObserver } from '~/app/shell/dapp-reveal-observer'
import { useDappTabContentFade } from '~/app/shell/dapp-content-fade'
import { DappTopbar } from '~/app/dapp-topbar'
import { DappScrollFadeHost } from '~/app/shell/dapp-scroll-fade-host'
import { HeroRaysBackground } from '~/shared/ui/hero-rays-background'
import { useDappShell } from '~/app/use-dapp-shell'
import { isThirdwebConfigured } from '~/web3/thirdweb'
import { scrollDappPanelsToTop } from '~/app/utils'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { invalidateTabQueries } from '~/shared/api/query/invalidate'
import { GenesisPromoSync } from '~/app/genesis-promo-sync'
import { GenesisSessionHost } from '~/views/dapp/genesis/genesis-session-host'
import { ExchangeSessionHosts } from '~/views/dapp/exchange/exchange-session-hosts'
import { DappTabContent, DappTabWidget } from '~/views/dapp/dapp-tabs'
import { OnboardingGuide, useOnboardingAutoStart } from '~/app/shell/onboarding-guide'
import { useConnectWarmPrefetch } from '~/web3/wallet/use-connect-warm-prefetch'

function replaceTabHash(tab: string) {
  window.history.replaceState(null, '', `#${tab}`)
}

export function DappShell() {
  const { messages } = useI18n()
  const activeTab = useDappShellStore((state) => state.activeTab)
  const mobileNavOpen = useDappShellStore((state) => state.mobileNavOpen)
  const selectTabInStore = useDappShellStore((state) => state.selectTab)
  const selectMobileTabInStore = useDappShellStore((state) => state.selectMobileTab)
  const setMobileNavOpen = useDappShellStore((state) => state.setMobileNavOpen)
  const syncTabFromHash = useDappShellStore((state) => state.syncTabFromHash)
  const resetForeignSubviewStores = useDappShellStore((state) => state.resetForeignSubviewStores)
  const shellState = useDappShell()
  const [windowNode, setWindowNode] = useState<HTMLDivElement | null>(null)
  const { displayTab, phase } = useDappTabContentFade(activeTab)
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
    invalidateTabQueries(displayTab)
    // After fade-out swaps displayTab, reset inactive rails — keeps leaving subview stable during fade.
    resetForeignSubviewStores(displayTab)
  }, [displayTab, resetForeignSubviewStores])

  // Mirror former store-side scroll: fire when an exchange subview transition starts.
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
  const effectiveDetailCollapsed = shellState.detailCollapsed

  return (
    <main
      className={cn(
        'relative flex h-dvh flex-col gap-0 overflow-hidden bg-background pt-0 text-muted-foreground',
        'max-dapp:bg-transparent',
      )}
    >
      {/* H5: peach→background wash fixed to the viewport (not the scrolling card). */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed inset-0 z-0',
          'hidden max-dapp:block',
          'bg-[linear-gradient(180deg,var(--dapp-h5-gradient-top)_0%,var(--background)_25%,var(--background)_100%)]',
        )}
      />
      <HeroRaysBackground variant="shell" />
      <DappTopbar onStartOnboarding={onboarding.startTour} onboardingDone={onboarding.done} />
      <OnboardingGuide onOpenChange={onboarding.setOpen} open={onboarding.open} />

      {import.meta.env.DEV && !isThirdwebConfigured ? (
        <DappInlineAlert
          as="div"
          density="comfortable"
          role="status"
          className="relative z-1 mx-4 mb-2"
        >
          未配置 <code className="font-mono">VITE_THIRDWEB_CLIENT_ID</code>
          ，钱包连接会 401。请复制 <code className="font-mono">.env.example</code> 为{' '}
          <code className="font-mono">.env</code>，填入 thirdweb Dashboard 的 Client ID 后重启{' '}
          <code className="font-mono">pnpm dev</code>。
        </DappInlineAlert>
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
          data-dapp-shell-container
        >
          <GenesisPromoSync />
          <GenesisSessionHost active={displayTab === 'genesis'}>
            {(genesis) => (
              <ExchangeSessionHosts activeTab={displayTab}>
                {({ trade, flash, burn, turbine }) => (
                  <div
                    ref={setWindowNode}
                    className={cn(
                      'group/shell relative z-1 mx-auto grid min-h-0 w-full border border-border bg-card shadow-window',
                      'rounded-xl dapp:h-full dapp:max-h-full dapp:max-w-none dapp:overflow-hidden',
                      !shellState.sessionReady && 'shadow-window-compact',
                      'max-dapp:flex max-dapp:h-full max-dapp:max-h-full max-dapp:min-h-0 max-dapp:max-w-none max-dapp:flex-1 max-dapp:flex-col max-dapp:gap-3',
                      'max-dapp:overflow-x-hidden max-dapp:overflow-y-auto max-dapp:rounded-t-2xl max-dapp:rounded-b-none max-dapp:border-0',
                      'max-dapp:px-4.5 max-dapp:pt-4.5 max-dapp:pb-8 max-dapp:shadow-card',
                    )}
                    data-collapsed={effectiveDetailCollapsed ? 'true' : 'false'}
                    data-session-ready={shellState.sessionReady ? 'true' : 'false'}
                    data-dapp-window
                    data-tab={displayTab}
                    data-wallet-ready={shellState.walletReady ? 'true' : 'false'}
                  >
                    <DappRail activeTab={activeTab} onSelectTab={selectTab} />

                    <DappScrollFadeHost>
                      <aside
                        className={cn(
                          'dapp-content-fade overflow-x-hidden border-r border-border bg-card px-6 pt-10 pb-5.5',
                          // PC: fill column and scroll inside the panel
                          'dapp:h-full dapp:max-h-full dapp:min-h-0 dapp:overflow-y-auto',
                          // H5: size to content; window is the only scroller (avoid flex-shrink overlap)
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
                            <DappIcon alt="" size="lg" src={dappAssets.menu} />
                          </button>
                        </div>
                        <DappMobileNav
                          activeTab={activeTab}
                          onClose={() => setMobileNavOpen(false)}
                          onSelectTab={selectMobileTab}
                          open={mobileNavOpen}
                        />
                        <DappTabWidget
                          activeTab={displayTab}
                          burn={burn}
                          flash={flash}
                          genesis={genesis}
                          onSelectTab={selectTab}
                          trade={trade}
                          turbine={turbine}
                        />
                      </aside>
                    </DappScrollFadeHost>

                    <DappScrollFadeHost
                      className={effectiveDetailCollapsed ? 'dapp:pointer-events-none' : undefined}
                    >
                      <section
                        className={cn(
                          'dapp-content-fade min-w-0 overflow-x-hidden bg-card',
                          // PC: fill column and scroll inside the panel
                          'dapp:max-h-full dapp:min-h-0',
                          effectiveDetailCollapsed
                            ? 'pointer-events-none overflow-y-hidden opacity-0'
                            : 'dapp:overflow-y-auto',
                          // H5: size to content under the shared window scroller
                          'max-dapp:pointer-events-auto max-dapp:h-auto max-dapp:max-h-none max-dapp:min-h-0 max-dapp:w-full max-dapp:shrink-0 max-dapp:overflow-visible',
                        )}
                        aria-hidden={effectiveDetailCollapsed}
                        aria-labelledby={`${displayTab}-title`}
                        data-dapp-detail
                        data-phase={effectiveDetailCollapsed ? 'idle' : phase}
                      >
                        <DappTabContent
                          activeTab={displayTab}
                          burn={burn}
                          flash={flash}
                          genesis={genesis}
                          trade={trade}
                          turbine={turbine}
                        />
                      </section>
                    </DappScrollFadeHost>
                  </div>
                )}
              </ExchangeSessionHosts>
            )}
          </GenesisSessionHost>
        </div>
      </section>

      <DappRevealObserver container={windowNode} />
    </main>
  )
}
