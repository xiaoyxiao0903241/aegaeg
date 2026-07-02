import { useActiveAccount, useIsAutoConnecting } from 'thirdweb/react'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useAuth } from '~/providers/auth-provider'
import {
  hasWalletAccount,
  isWalletRestorePending,
} from '~/lib/web3/wallet-connection-state'
import type { DappTab } from '~/app/types'

export interface DappShellState {
  tab: DappTab
  /** SIWE session ready — drives API data and logged-in UI. */
  sessionReady: boolean
  /** Wallet connected but JWT missing — show sign-in CTA. */
  needsSignIn: boolean
  /** thirdweb active account — drives sign / send tx. Real-time from wallet SDK. */
  walletReady: boolean
  /** AutoConnect still restoring a previous wallet session. */
  isWalletConnecting: boolean
  detailCollapsed: boolean
}

export function useDappShell(): DappShellState {
  const account = useActiveAccount()
  const isAutoConnecting = useIsAutoConnecting()
  const { isAuthenticated, needsSignIn } = useAuth()
  const tab = useDappShellStore((state) => state.activeTab)
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const walletReady = hasWalletAccount(account)
  const sessionReady = isAuthenticated
  const isWalletConnecting = isWalletRestorePending(account, isAutoConnecting)

  return {
    tab,
    sessionReady,
    needsSignIn,
    walletReady,
    isWalletConnecting,
    detailCollapsed,
  }
}
