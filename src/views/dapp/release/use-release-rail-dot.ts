import { useQuery } from '@tanstack/react-query'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readReleaseHasClaimable } from '~/web3/release/release-read'

/** Release rail red-dot when queue or buffer has claimable AGX. */
export function useReleaseRailDot(enabled: boolean) {
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const walletReady = hasWalletAccount(account)
  const address = account?.address

  const query = useQuery({
    queryKey: queryKeys.chain.releaseClaimable(address ?? ''),
    queryFn: () => readReleaseHasClaimable(address as `0x${string}`, readClient),
    enabled: enabled && walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  return Boolean(query.data)
}
