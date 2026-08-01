import { useAuth } from '~/hooks/use-auth'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useActiveAccount, useIsAutoConnecting } from '~/web3/thirdweb-react'
import { hasWalletAccount, isWalletRestorePending } from '~/web3/wallet/wallet-connection-state'

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
  const { sessionReady, needsSignIn } = useAuth()
  const tab = useDappShellStore((state) => state.activeTab)
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const walletReady = hasWalletAccount(account)
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
