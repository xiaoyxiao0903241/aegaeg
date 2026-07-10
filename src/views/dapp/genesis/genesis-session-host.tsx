import type { ReactNode } from 'react'
import { useGenesisWidget } from '~/views/dapp/genesis/use-genesis-widget'
import { resolveWalletRemountKey } from '~/shared/lib/resolve-wallet-remount-key'
import { useActiveAccount } from '~/web3/thirdweb-react'

export type GenesisWidgetState = ReturnType<typeof useGenesisWidget>

function GenesisSessionMounted({
  children,
}: {
  children: (genesis: GenesisWidgetState) => ReactNode
}) {
  const genesis = useGenesisWidget()
  return children(genesis)
}

/**
 * Lifts Genesis widget hook once (wallet remount clears draft) and passes state as props.
 * Only mounts while Genesis tab is active — same as former GenesisWidgetProvider gate.
 */
export function GenesisSessionHost({
  active,
  children,
}: {
  active: boolean
  children: (genesis: GenesisWidgetState | null) => ReactNode
}) {
  const account = useActiveAccount()
  const remountKey = resolveWalletRemountKey(account?.address)

  if (!active) {
    return children(null)
  }

  return (
    <GenesisSessionMounted key={remountKey}>
      {(genesis) => children(genesis)}
    </GenesisSessionMounted>
  )
}
