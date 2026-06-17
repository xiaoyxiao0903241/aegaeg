import { useEffect, useMemo, useState } from 'react'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
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
import { SwapMobilePager } from '~/app/components/swap-mobile-pager'
import type { DappTab, DetailPanelControls } from '~/app/types'
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
  const { messages: t } = useI18n()
  const activeTab = useDappShellStore((state) => state.activeTab)
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const mobileNavOpen = useDappShellStore((state) => state.mobileNavOpen)
  const selectTab = useDappShellStore((state) => state.selectTab)
  const selectMobileTab = useDappShellStore((state) => state.selectMobileTab)
  const toggleDetailCollapsed = useDappShellStore((state) => state.toggleDetailCollapsed)
  const setMobileNavOpen = useDappShellStore((state) => state.setMobileNavOpen)
  const syncTabFromHash = useDappShellStore((state) => state.syncTabFromHash)
  const shellState = useDappShell()
  const isMobileViewport = useMobileViewport()
  const [windowNode, setWindowNode] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    syncTabFromHash()
    window.addEventListener('hashchange', syncTabFromHash)
    return () => window.removeEventListener('hashchange', syncTabFromHash)
  }, [syncTabFromHash])

  const detailPanel = useMemo<DetailPanelControls>(
    () => ({
      collapsed: shellState.detailCollapsed,
      onToggle: toggleDetailCollapsed,
    }),
    [shellState.detailCollapsed, toggleDetailCollapsed],
  )

  const mobileNavId = 'dapp-mobile-nav'
  const effectiveDetailCollapsed = shellState.detailCollapsed
  const useSwapMobilePager =
    isMobileViewport && activeTab === 'swap' && shellState.connected
  return (
    <main
      className={cn(
        shellPageClass,
        useSwapMobilePager &&
          'max-[820px]:flex max-[820px]:h-dvh max-[820px]:max-h-dvh max-[820px]:flex-col max-[820px]:overflow-hidden',
      )}
    >
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
          className={shellStageClass({
            tab: activeTab,
            connected: shellState.connected,
            detailCollapsed: effectiveDetailCollapsed,
            mobileSwapPager: useSwapMobilePager,
          })}
          aria-label="AEGIS X DApp"
        >
          <div className={shellContainerClass(useSwapMobilePager)}>
            <GenesisWidgetProvider>
              {useSwapMobilePager ? (
                <div className="flex min-h-0 flex-1 flex-col">
                  <SwapMobilePager
                    connected={shellState.connected}
                    detailPanel={detailPanel}
                    onSelectGenesis={() => selectTab('genesis')}
                    windowClassName={shellWindowClass({
                      tab: activeTab,
                      connected: shellState.connected,
                      detailCollapsed: effectiveDetailCollapsed,
                      mobileSwapPager: true,
                    })}
                    windowDataset={{
                      tab: activeTab,
                      connected: shellState.connected ? 'true' : 'false',
                      walletReady: shellState.walletReady ? 'true' : 'false',
                      collapsed: effectiveDetailCollapsed ? 'true' : 'false',
                    }}
                    windowRef={setWindowNode}
                  />
                </div>
              ) : (
                <div
                  ref={setWindowNode}
                  className={shellWindowClass({
                    tab: activeTab,
                    connected: shellState.connected,
                    detailCollapsed: effectiveDetailCollapsed,
                  })}
                  data-collapsed={effectiveDetailCollapsed ? 'true' : 'false'}
                  data-connected={shellState.connected ? 'true' : 'false'}
                  data-dapp-window
                  data-tab={activeTab}
                  data-wallet-ready={shellState.walletReady ? 'true' : 'false'}
                >
                  <DappRail activeTab={activeTab} onSelectTab={selectTab} />

                  <aside className={shellWidgetClass()}>
                    <div className={shellMobileDrawerClass}>
                      <button
                        aria-controls={mobileNavId}
                        aria-expanded={mobileNavOpen}
                        aria-label={t.topbar.openMenu}
                        className={shellMobileDrawerSummaryClass}
                        onClick={() => setMobileNavOpen(true)}
                        type="button"
                      >
                        <img alt="" height="18" src={dappAssets.menu} width="18" />
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
                      connected={shellState.connected}
                      detailPanel={detailPanel}
                      onSelectTab={selectTab}
                    />
                  </aside>

                  <section
                    className={shellContentClass(effectiveDetailCollapsed)}
                    aria-hidden={effectiveDetailCollapsed}
                    aria-labelledby={`${activeTab}-title`}
                    data-dapp-detail
                  >
                    <div className="dapp-detail-panel" key={activeTab}>
                      <TabContent
                        activeTab={activeTab}
                        connected={shellState.connected}
                        onSelectTab={selectTab}
                      />
                    </div>
                  </section>
                </div>
              )}
            </GenesisWidgetProvider>
          </div>
        </section>

        <DappRevealObserver container={windowNode} />
      </main>
  )
}

function TabWidget({
  activeTab,
  connected,
  detailPanel,
  onSelectTab,
}: {
  activeTab: DappTab
  connected: boolean
  detailPanel: DetailPanelControls
  onSelectTab: (tab: DappTab) => void
}) {
  if (activeTab === 'genesis') {
    return (
      <GenesisWidget
        detailPanel={detailPanel}
        onSelectGenesis={() => onSelectTab('genesis')}
      />
    )
  }

  if (activeTab === 'rewards') {
    return <RewardsWidget detailPanel={detailPanel} />
  }

  if (activeTab === 'community') {
    return (
      <CommunityWidget
        connected={connected}
        detailPanel={detailPanel}
        onSelectTab={onSelectTab}
      />
    )
  }

  return (
    <SwapWidget
      connected={connected}
      detailPanel={detailPanel}
      onSelectGenesis={() => onSelectTab('genesis')}
    />
  )
}

function TabContent({
  activeTab,
  connected,
  onSelectTab,
}: {
  activeTab: DappTab
  connected: boolean
  onSelectTab: (tab: DappTab) => void
}) {
  if (activeTab === 'genesis') {
    return <GenesisContent />
  }

  if (activeTab === 'rewards') {
    return <RewardsContent />
  }

  if (activeTab === 'community') {
    return <CommunityContent connected={connected} onSelectTab={onSelectTab} />
  }

  return <SwapContent connected={connected} />
}
