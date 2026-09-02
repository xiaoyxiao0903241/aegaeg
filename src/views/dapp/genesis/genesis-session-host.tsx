import type { ReactNode } from 'react'

import { walletRemountKey } from '~/shared/lib/utils'
import { useGenesisSession } from '~/views/dapp/genesis/use-genesis-session'
import { useActiveAccount } from '~/web3/thirdweb-react'

export type GenesisSessionState = ReturnType<typeof useGenesisSession>

function GenesisSessionMounted({
  children,
}: {
  children: (genesis: GenesisSessionState) => ReactNode
}) {
  const genesis = useGenesisSession()
  return children(genesis)
}

/**
 * 创世会话宿主
 *
 * 把创世 session hook 提升为单一实例并以 props 下发；
 * 钱包切换时通过 key 重建以清空购买草稿，
 * 仅在创世 Tab 激活时挂载，未激活时向子级传 null。
 */
export function GenesisSessionHost({
  active,
  children,
}: {
  active: boolean
  children: (genesis: GenesisSessionState | null) => ReactNode
}) {
  const account = useActiveAccount()
  const remountKey = walletRemountKey(account?.address)

  if (!active) {
    return children(null)
  }

  return (
    <GenesisSessionMounted key={remountKey}>{(genesis) => children(genesis)}</GenesisSessionMounted>
  )
}
