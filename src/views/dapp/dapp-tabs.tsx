import { getDappTabEntry } from '~/views/dapp/dapp-tab-registry'
import type { DappTab } from '~/shared/config/dapp-tabs'
import type { DappTabSessions } from '~/views/dapp/dapp-tab-sessions'

export function DappTabWidget({
  activeTab,
  onSelectTab,
  trade,
  flash,
  genesis,
}: {
  activeTab: DappTab
  onSelectTab: (tab: DappTab) => void
} & DappTabSessions) {
  const { Widget } = getDappTabEntry(activeTab)
  return <Widget flash={flash} genesis={genesis} onSelectTab={onSelectTab} trade={trade} />
}

export function DappTabContent({
  activeTab,
  trade,
  flash,
  genesis,
}: {
  activeTab: DappTab
} & DappTabSessions) {
  const { Content } = getDappTabEntry(activeTab)
  return <Content flash={flash} genesis={genesis} trade={trade} />
}
