import { getDappTabEntry } from '~/views/dapp/dapp-tab-registry'
import type { DappTab } from '~/shared/config/dapp-tabs'

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
