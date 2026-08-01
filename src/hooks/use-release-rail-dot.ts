import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readReleaseHasClaimable } from '~/web3/release/release-read'

/** Release rail red-dot when queue or buffer has claimable AGX. */
export function useReleaseRailDot(enabled: boolean) {
  const query = useChainQuery({
    queryKey: queryKeys.chain.releaseClaimable,
    queryFn: (addr) => readReleaseHasClaimable(addr as `0x${string}`),
    enabled,
  })

  return Boolean(query.data)
}
