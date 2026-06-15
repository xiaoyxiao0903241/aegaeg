import { useActiveAccount, useIsAutoConnecting } from 'thirdweb/react'
import { useDappShellStore } from '../stores/dapp-shell-store'
import { useAuth } from '../providers/auth-provider'
import {
  hasWalletAccount,
  isWalletRestorePending,
} from '../lib/web3/wallet-connection-state'
import type { DappTab } from './types'

export interface DappShellState {
  tab: DappTab
  /** SIWE session ready — drives API data and logged-in UI. */
  connected: boolean
  /** thirdweb active account — drives sign / send tx. Real-time from wallet SDK. */
  walletReady: boolean
  /** AutoConnect still restoring a previous wallet session. */
  isWalletConnecting: boolean
  detailCollapsed: boolean
}

export function useDappShell(): DappShellState {
  const account = useActiveAccount()
  const isAutoConnecting = useIsAutoConnecting()
  const { isAuthenticated, isLoggingIn } = useAuth()
  const tab = useDappShellStore((state) => state.activeTab)
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const connected = isAuthenticated || isLoggingIn
  const isWalletConnecting = isWalletRestorePending(account, isAutoConnecting)
  const walletReady = hasWalletAccount(account)

  return {
    tab,
    connected,
    walletReady,
    isWalletConnecting,
    detailCollapsed: connected && detailCollapsed,
  }
}
