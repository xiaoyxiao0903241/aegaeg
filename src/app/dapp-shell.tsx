import { useEffect, useMemo, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useI18n } from '../i18n/use-i18n'
import { dappAssets } from './assets'
import { DappRail } from './dapp-rail'
import { DappMobileNav } from './components/dapp-mobile-nav'
import { DappRevealObserver } from './components/dapp-reveal-observer'
import { DappTopbar } from './dapp-topbar'
import { CommunityContent, CommunityWidget } from './tabs/community-tab'
import { GenesisContent, GenesisWidget } from './tabs/genesis-tab'
import { GenesisWidgetProvider } from './genesis-widget-context'
import { RewardsContent, RewardsWidget } from './tabs/rewards-tab'
import { SwapContent, SwapWidget } from './tabs/swap-tab'
import type { DappTab, DetailPanelControls } from './types'
import { getInitialTab, isDappTab } from './utils'
import { DappShellProvider } from './dapp-shell-context'
import {
  shellContainerClass,
  shellContentClass,
  shellMobileDrawerClass,
  shellMobileDrawerSummaryClass,
  shellPageClass,
  shellStageClass,
  shellWidgetClass,
  shellWindowClass,
} from './shell-layout'
import { isThirdwebConfigured } from '../web3/thirdweb'

export function DappShell() {
  const account = useActiveAccount()
  const { messages: t } = useI18n()
  const [activeTab, setActiveTab] = useState<DappTab>(getInitialTab)
  const [detailCollapsed, setDetailCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [windowNode, setWindowNode] = useState<HTMLDivElement | null>(null)

  const connected = Boolean(account)

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1)
      if (isDappTab(hash)) {
        setActiveTab(hash)
      }
    }

    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  function selectTab(tab: DappTab) {
    setActiveTab(tab)
    window.history.replaceState(null, '', `#${tab}`)
  }

  function selectMobileTab(tab: DappTab) {
    selectTab(tab)
    setMobileNavOpen(false)
  }

  const detailPanel = useMemo<DetailPanelControls>(
    () => ({
      collapsed: connected && detailCollapsed,
      onToggle: () => setDetailCollapsed((collapsed) => !collapsed),
    }),
    [connected, detailCollapsed],
  )

  const mobileNavId = 'dapp-mobile-nav'
  const effectiveDetailCollapsed = connected && detailCollapsed
  const shellState = {
    tab: activeTab,
    connected,
    detailCollapsed: effectiveDetailCollapsed,
  }
  return (
    <DappShellProvider value={shellState}>
      <main className={shellPageClass}>
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
          className={shellStageClass(shellState)}
          aria-label="AEGIS X DApp"
        >
          <div className={shellContainerClass}>
            <div
              ref={setWindowNode}
              className={shellWindowClass(shellState)}
              data-dapp-window
              data-tab={activeTab}
              data-connected={connected ? 'true' : 'false'}
              data-collapsed={effectiveDetailCollapsed ? 'true' : 'false'}
            >
              <GenesisWidgetProvider connected={connected} enabled={activeTab === 'genesis'}>
                <>
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
                      activeTab={activeTab}
                      connected={connected}
                      detailPanel={detailPanel}
                      onSelectTab={selectTab}
                    />
                  </aside>

                  <section
                    className={shellContentClass(effectiveDetailCollapsed)}
                    aria-hidden={effectiveDetailCollapsed}
                    aria-labelledby={`${activeTab}-title`}
                  >
                    <TabContent
                      activeTab={activeTab}
                      connected={connected}
                      onSelectTab={selectTab}
                    />
                  </section>
                </>
              </GenesisWidgetProvider>
            </div>
          </div>
        </section>

        <DappRevealObserver container={windowNode} />
      </main>
    </DappShellProvider>
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
