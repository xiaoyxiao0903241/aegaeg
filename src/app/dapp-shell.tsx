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
import { RewardsContent, RewardsWidget } from './tabs/rewards-tab'
import { SwapContent, SwapWidget } from './tabs/swap-tab'
import type { DappTab, DetailPanelControls } from './types'
import { formatAddress, getInitialTab, isDappTab } from './utils'
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

type WalletPreviewState = 'connected' | 'disconnected' | 'real'

function getInitialWalletPreview(): WalletPreviewState {
  const value = new URLSearchParams(window.location.search).get('previewWallet')
  return value === 'connected' || value === 'disconnected' ? value : 'real'
}

export function DappShell() {
  const account = useActiveAccount()
  const { messages: t } = useI18n()
  const [activeTab, setActiveTab] = useState<DappTab>(getInitialTab)
  const [detailCollapsed, setDetailCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [walletPreview, setWalletPreview] =
    useState<WalletPreviewState>(getInitialWalletPreview)
  const [windowNode, setWindowNode] = useState<HTMLDivElement | null>(null)

  const connected =
    walletPreview === 'connected'
      ? true
      : walletPreview === 'disconnected'
        ? false
        : Boolean(account)
  const addressLabel = useMemo(
    () =>
      connected && account && walletPreview === 'real'
        ? formatAddress(account.address)
        : connected
          ? '0x8F32…91A2'
          : t.common.connectWallet,
    [account, connected, t.common.connectWallet, walletPreview],
  )

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

  function toggleWalletPreview() {
    const nextPreview: WalletPreviewState = connected ? 'disconnected' : 'connected'
    const url = new URL(window.location.href)
    url.searchParams.set('previewWallet', nextPreview)
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
    setWalletPreview(nextPreview)
    setDetailCollapsed(false)
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
        <DappTopbar
          addressLabel={addressLabel}
          connected={connected}
          onToggleWalletPreview={toggleWalletPreview}
          walletPreviewConnected={connected}
        />

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
