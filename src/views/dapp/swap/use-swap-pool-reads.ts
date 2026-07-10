import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { SwapPoolReadContext } from '~/web3/swap-read'
import {
  readSwapPoolImmutableMetadata,
  readSwapPoolSpotPrice,
} from '~/web3/read-swap-pool'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useChainReadClient } from '~/web3/use-chain-read-client'

/** Shared pool metadata + slot0 spot — short-stale spot reused across swap quotes. */
export function useSwapPoolReads(quotesEnabled = true) {
  const readClient = useChainReadClient()

  const metadataQuery = useQuery({
    queryKey: queryKeys.chain.swapPoolMetadata,
    queryFn: () => readSwapPoolImmutableMetadata(SWAP_CONFIG.pool, readClient),
    enabled: quotesEnabled,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const spotQuery = useQuery({
    queryKey: queryKeys.chain.swapPoolSpot,
    queryFn: () => readSwapPoolSpotPrice(SWAP_CONFIG.pool, readClient),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleInterval(spotQuery, SWAP_CONFIG.quoteRefreshIntervalMs, quotesEnabled)

  const poolContext: SwapPoolReadContext | undefined =
    metadataQuery.data && spotQuery.data
      ? { pool: metadataQuery.data, spot: spotQuery.data }
      : undefined

  return {
    poolContext,
    poolFee: metadataQuery.data?.fee ?? SWAP_CONFIG.feeTier,
    metadataQuery,
    spotQuery,
  }
}
