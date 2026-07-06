import { useEffect, useState } from 'react'
import { cn } from '~/shared/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { DappIcon } from '~/app/components/dapp-icon'
import { dappAssets } from '~/app/assets'
import { DappRail } from '~/app/dapp-rail'
import { DappMobileNav } from '~/app/components/dapp-mobile-nav'
import { DappRevealObserver } from '~/app/components/dapp-reveal-observer'
import { DappTopbar } from '~/app/dapp-topbar'
import { DappScrollFadeHost } from '~/app/components/dapp-scroll-fade-host'
import { HeroRaysBackground, heroRaysShellClass } from '~/shared/ui/hero-rays-background'
import { useDappShell } from '~/app/dapp-shell-context'
import {
  shellContainerClass,
  shellContentClass,
  shellMobileDrawerClass,
  shellMobileDrawerSummaryClass,
  shellPageClass,
  shellStageClass,
  shellWidgetClass,
  shellWindowClass,
} from '~/app/shell-layout'
import { isThirdwebConfigured } from '~/views/dapp/web3/thirdweb'
import { scrollDappPanelsToTop } from '~/app/utils'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { invalidateTabQueries } from '~/shared/api/query/invalidate'
import {
  DappTabContent,
  DappTabShellProviders,
  DappTabWidget,
} from '~/views/dapp/dapp-tabs'

export function DappShell() {
  const { messages } = useI18n()
  const activeTab = useDappShellStore((state) => state.activeTab)
  const mobileNavOpen = useDappShellStore((state) => state.mobileNavOpen)
  const selectTab = useDappShellStore((state) => state.selectTab)
  const selectMobileTab = useDappShellStore((state) => state.selectMobileTab)
  const setMobileNavOpen = useDappShellStore((state) => state.setMobileNavOpen)
  const syncTabFromHash = useDappShellStore((state) => state.syncTabFromHash)
  const shellState = useDappShell()
  const [windowNode, setWindowNode] = useState<HTMLDivElement | null>(null)

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
    invalidateTabQueries(activeTab)
  }, [activeTab])

  const mobileNavId = 'dapp-mobile-nav'
  const effectiveDetailCollapsed = shellState.detailCollapsed

  return (
    <main className={shellPageClass}>
      <HeroRaysBackground className={heroRaysShellClass} variant="shell" />
      <DappTopbar />

      {import.meta.env.DEV && !isThirdwebConfigured ? (
        <div
          className="mx-4 mb-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive"
          role="status"
        >
          未配置 <code className="font-mono">VITE_THIRDWEB_CLIENT_ID</code>
          ，钱包连接会 401。请复制 <code className="font-mono">.env.example</code>{' '}
          为 <code className="font-mono">.env</code>，填入 thirdweb Dashboard 的 Client
          ID 后重启 <code className="font-mono">pnpm dev</code>。
        </div>
      ) : null}

      <section
        className={cn(
          shellStageClass(),
          'dapp:overflow-visible',
        )}
        aria-label="AEGIS X DApp"
      >
        <div className={cn(shellContainerClass(), 'relative z-1')} data-dapp-shell-container>
          <DappTabShellProviders activeTab={activeTab}>
            <div
              ref={setWindowNode}
              className={cn(
                shellWindowClass({
                  tab: activeTab,
                  sessionReady: shellState.sessionReady,
                  detailCollapsed: effectiveDetailCollapsed,
                }),
                'relative z-1',
              )}
              data-collapsed={effectiveDetailCollapsed ? 'true' : 'false'}
              data-session-ready={shellState.sessionReady ? 'true' : 'false'}
              data-dapp-window
              data-tab={activeTab}
              data-wallet-ready={shellState.walletReady ? 'true' : 'false'}
            >
              <DappRail activeTab={activeTab} onSelectTab={selectTab} />

              <DappScrollFadeHost>
                <aside className={shellWidgetClass()} data-dapp-widget-panel>
                  <div className={shellMobileDrawerClass} data-dapp-h5-menu>
                    <button
                      aria-controls={mobileNavId}
                      aria-expanded={mobileNavOpen}
                      aria-label={messages.topbar.openMenu}
                      className={shellMobileDrawerSummaryClass}
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
                    key={activeTab}
                    activeTab={activeTab}
                    onSelectTab={selectTab}
                  />
                </aside>
              </DappScrollFadeHost>

              <DappScrollFadeHost
                className={effectiveDetailCollapsed ? 'dapp:pointer-events-none' : undefined}
              >
                <section
                  className={shellContentClass(effectiveDetailCollapsed)}
                  aria-hidden={effectiveDetailCollapsed}
                  aria-labelledby={`${activeTab}-title`}
                  data-dapp-detail
                >
                  <div className="dapp-detail-panel" key={activeTab}>
                    <DappTabContent activeTab={activeTab} />
                  </div>
                </section>
              </DappScrollFadeHost>
            </div>
          </DappTabShellProviders>
        </div>
      </section>

      <DappRevealObserver container={windowNode} />
    </main>
  )
}
