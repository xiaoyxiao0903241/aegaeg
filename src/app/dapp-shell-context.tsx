import { useActiveAccount } from 'thirdweb/react'
import { useDappShellStore } from '../stores/dapp-shell-store'
import type { DappTab } from './types'

export interface DappShellState {
  tab: DappTab
  connected: boolean
  detailCollapsed: boolean
}

export function useDappShell(): DappShellState {
  const account = useActiveAccount()
  const tab = useDappShellStore((state) => state.activeTab)
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const connected = Boolean(account)

  return {
    tab,
    connected,
    detailCollapsed: connected && detailCollapsed,
  }
}
