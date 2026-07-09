import { useEffect, useState } from 'react'
import { cn } from '~/shared/lib/utils'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { useI18n } from '~/i18n/use-i18n'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { dappAssets } from '~/app/assets'
import { DappRail } from '~/app/dapp-rail'
import { DappMobileNav } from '~/app/shell/components/dapp-mobile-nav'
import { DappRevealObserver } from '~/app/shell/components/dapp-reveal-observer'
import { DappTopbar } from '~/app/dapp-topbar'
import { DappScrollFadeHost } from '~/app/shell/components/dapp-scroll-fade-host'
import { HeroRaysBackground } from '~/shared/ui/hero-rays-background'
import { useDappShell } from '~/app/dapp-shell-context'
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
    <main
      className={cn(
        'relative flex h-dvh flex-col gap-0 bg-background pt-0 text-muted-foreground',
        'dapp:h-dvh dapp:overflow-hidden',
        'max-dapp:bg-[linear-gradient(180deg,var(--dapp-h5-gradient-top)_0%,var(--background)_25%,var(--background)_100%)]',
        'max-dapp:h-auto max-dapp:min-h-dvh max-dapp:overflow-x-clip max-dapp:overflow-y-visible',
      )}
    >
      <HeroRaysBackground variant="shell" />
      <DappTopbar />

      {import.meta.env.DEV && !isThirdwebConfigured ? (
        <DappInlineAlert
          as="div"
          density="comfortable"
          role="status"
          className="mx-4 mb-2"
        >
          未配置 <code className="font-mono">VITE_THIRDWEB_CLIENT_ID</code>
          ，钱包连接会 401。请复制 <code className="font-mono">.env.example</code>{' '}
          为 <code className="font-mono">.env</code>，填入 thirdweb Dashboard 的 Client
          ID 后重启 <code className="font-mono">pnpm dev</code>。
        </DappInlineAlert>
      ) : null}

      <section
        className={cn(
          'relative z-1 flex min-h-0 flex-1 flex-col overflow-visible px-0',
          'dapp:min-h-0 dapp:flex-1 dapp:items-center dapp:justify-stretch dapp:overflow-visible dapp:pb-4',
          'max-dapp:flex-none max-dapp:overflow-visible max-dapp:pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]',
        )}
        aria-label="AEGIS X DApp"
      >
        <div
          className={cn(
            'relative z-1 mx-auto flex h-full min-h-0 w-full flex-col',
            'dapp:max-w-none dapp:flex-1 dapp:items-center dapp:px-0',
            'max-dapp:h-auto max-dapp:max-w-none max-dapp:px-0',
          )}
          data-dapp-shell-container
        >
          <DappTabShellProviders activeTab={activeTab}>
            <div
              ref={setWindowNode}
              className={cn(
                'group/shell relative z-1 mx-auto grid w-full min-h-0 overflow-hidden border border-border bg-card shadow-window',
                'rounded-xl dapp:h-full dapp:max-h-full dapp:max-w-none',
                !shellState.sessionReady && 'shadow-window-compact',
                'max-dapp:flex max-dapp:h-auto max-dapp:max-h-none max-dapp:min-h-0 max-dapp:max-w-none max-dapp:flex-col max-dapp:gap-3',
                'max-dapp:overflow-hidden max-dapp:rounded-2xl max-dapp:border-0 max-dapp:p-4.5 max-dapp:shadow-card',
              )}
              data-collapsed={effectiveDetailCollapsed ? 'true' : 'false'}
              data-session-ready={shellState.sessionReady ? 'true' : 'false'}
              data-dapp-window
              data-tab={activeTab}
              data-wallet-ready={shellState.walletReady ? 'true' : 'false'}
            >
              <DappRail activeTab={activeTab} onSelectTab={selectTab} />

              <DappScrollFadeHost>
                <aside
                  className={cn(
                    'h-full min-h-0 max-h-full overflow-y-auto overflow-x-hidden border-r border-border bg-card px-6 pb-5.5 pt-10',
                    'max-dapp:h-auto max-dapp:max-h-none max-dapp:w-full max-dapp:overflow-visible max-dapp:border-r-0 max-dapp:border-b-0 max-dapp:p-0',
                  )}
                  data-dapp-widget-panel
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
                  className={cn(
                    'min-h-0 min-w-0 max-h-full overflow-x-hidden bg-card transition-opacity duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    effectiveDetailCollapsed
                      ? 'pointer-events-none overflow-y-hidden opacity-0'
                      : 'overflow-y-auto opacity-100',
                    'max-dapp:pointer-events-auto max-dapp:w-full max-dapp:min-h-0 max-dapp:overflow-visible max-dapp:opacity-100',
                  )}
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
