import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { DappIcon } from '~/app/components/dapp-icon'
import { dappAssets } from '~/app/assets'
import { DappRail } from '~/app/dapp-rail'
import { DappMobileNav } from '~/app/components/dapp-mobile-nav'
import { DappRevealObserver } from '~/app/components/dapp-reveal-observer'
import { DappTopbar } from '~/app/dapp-topbar'
import { CommunityContent, CommunityWidget } from '~/app/tabs/community-tab'
import { GenesisContent, GenesisWidget } from '~/app/tabs/genesis-tab'
import { GenesisWidgetProvider } from '~/app/genesis-widget-context'
import { RewardsContent, RewardsWidget } from '~/app/tabs/rewards-tab'
import { SwapContent, SwapWidget } from '~/app/tabs/swap-tab'
import { DappScrollFadeHost } from '~/app/components/dapp-scroll-fade-host'
import { HeroRaysBackground, heroRaysShellClass } from '~/components/hero-rays-background'
import type { DappTab } from '~/app/types'
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
import { isThirdwebConfigured } from '~/web3/thirdweb'
import { useDappShellStore } from '~/stores/dapp-shell-store'

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
          <GenesisWidgetProvider>
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
                <aside className={shellWidgetClass()}>
                  <div className={shellMobileDrawerClass}>
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
                  <TabWidget
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
                    <TabContent activeTab={activeTab} onSelectTab={selectTab} />
                  </div>
                </section>
              </DappScrollFadeHost>
            </div>
          </GenesisWidgetProvider>
        </div>
      </section>

      <DappRevealObserver container={windowNode} />
    </main>
  )
}

function TabWidget({
  activeTab,
  onSelectTab,
}: {
  activeTab: DappTab
  onSelectTab: (tab: DappTab) => void
}) {
  if (activeTab === 'genesis') {
    return <GenesisWidget onSelectGenesis={() => onSelectTab('genesis')} />
  }

  if (activeTab === 'rewards') {
    return <RewardsWidget />
  }

  if (activeTab === 'community') {
    return <CommunityWidget onSelectTab={onSelectTab} />
  }

  return <SwapWidget onSelectGenesis={() => onSelectTab('genesis')} />
}

function TabContent({
  activeTab,
  onSelectTab,
}: {
  activeTab: DappTab
  onSelectTab: (tab: DappTab) => void
}) {
  if (activeTab === 'genesis') {
    return <GenesisContent />
  }

  if (activeTab === 'rewards') {
    return <RewardsContent />
  }

  if (activeTab === 'community') {
    return <CommunityContent onSelectTab={onSelectTab} />
  }

  return <SwapContent />
}
