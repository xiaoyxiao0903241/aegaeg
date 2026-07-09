import { type ReactNode } from 'react'
import { useGenesisWidget } from '~/hooks/use-genesis-widget'
import { GenesisWidgetContext } from '~/app/use-genesis-widget-context'
import { resolveWalletRemountKey } from '~/shared/lib/resolve-wallet-remount-key'
import { useActiveAccount } from '~/views/dapp/web3/thirdweb-react'

function GenesisWidgetProviderInner({ children }: { children: ReactNode }) {
  const value = useGenesisWidget()
  return <GenesisWidgetContext.Provider value={value}>{children}</GenesisWidgetContext.Provider>
}

/** Remount widget state when wallet address changes (clears shares/error without effect). */
export function GenesisWidgetProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount()
  const key = resolveWalletRemountKey(account?.address)
  return <GenesisWidgetProviderInner key={key}>{children}</GenesisWidgetProviderInner>
}
