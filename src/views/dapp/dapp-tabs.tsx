import type { ComponentType, ReactNode } from 'react'
import { CommunityContent, CommunityWidget } from '~/views/dapp/community'
import { GenesisContent, GenesisWidget } from '~/views/dapp/genesis'
import { GenesisWidgetProvider } from '~/app/genesis-widget-context'
import { RewardsContent, RewardsWidget } from '~/views/dapp/rewards'
import { SwapContent, SwapWidget } from '~/views/dapp/swap'
import { SwapSubviewProviders } from '~/views/dapp/swap/swap-subview-providers'
import { scrollDappPanelsToTop } from '~/app/utils'
import { tabOrder, type DappTab } from '~/views/dapp/dapp-tab-order'

export { tabOrder, type DappTab } from '~/views/dapp/dapp-tab-order'

type TabWidgetProps = {
  onSelectTab: (tab: DappTab) => void
}

export type DappTabEntry = {
  id: DappTab
  Widget: ComponentType<TabWidgetProps>
  Content: ComponentType
}

function SwapTabWidget({ onSelectTab }: TabWidgetProps) {
  return (
    <SwapWidget
      onSelectGenesis={() => {
        onSelectTab('genesis')
        scrollDappPanelsToTop()
      }}
    />
  )
}

function GenesisTabWidget(_props: TabWidgetProps) {
  return <GenesisWidget />
}

function RewardsTabWidget(_props: TabWidgetProps) {
  return <RewardsWidget />
}

function CommunityTabWidget({ onSelectTab }: TabWidgetProps) {
  return <CommunityWidget onSelectTab={onSelectTab} />
}

/** Static tab registry — R3-move updates module paths here only. */
export const dappTabEntries: readonly DappTabEntry[] = [
  { id: 'swap', Widget: SwapTabWidget, Content: SwapContent },
  { id: 'genesis', Widget: GenesisTabWidget, Content: GenesisContent },
  { id: 'rewards', Widget: RewardsTabWidget, Content: RewardsContent },
  { id: 'community', Widget: CommunityTabWidget, Content: CommunityContent },
]

const dappTabEntryById = Object.fromEntries(
  dappTabEntries.map((entry) => [entry.id, entry]),
) as Record<DappTab, DappTabEntry>

export function getDappTabEntry(tab: DappTab): DappTabEntry {
  return dappTabEntryById[tab]
}

/** Shell-level providers co-located with swap tab (SwapSubviewProviders). */
export function DappTabShellProviders({
  activeTab,
  children,
}: {
  activeTab: DappTab
  children: ReactNode
}) {
  return (
    <GenesisWidgetProvider>
      <SwapSubviewProviders activeTab={activeTab}>{children}</SwapSubviewProviders>
    </GenesisWidgetProvider>
  )
}

export function DappTabWidget({
  activeTab,
  onSelectTab,
}: {
  activeTab: DappTab
  onSelectTab: (tab: DappTab) => void
}) {
  const { Widget } = getDappTabEntry(activeTab)
  return <Widget onSelectTab={onSelectTab} />
}

export function DappTabContent({ activeTab }: { activeTab: DappTab }) {
  const { Content } = getDappTabEntry(activeTab)
  return <Content />
}
