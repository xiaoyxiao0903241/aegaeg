import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { ExchangePoolReadContext } from '~/web3/exchange/exchange-read'
import {
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
} from '~/web3/exchange/read-exchange-pool'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useChainReadClient } from '~/web3/use-chain-read-client'

/** Shared V2 pair metadata + reserves — short-stale spot reused across exchange quotes. */
export function useExchangePoolReads(quotesEnabled = true) {
  const readClient = useChainReadClient()

  const metadataQuery = useQuery({
    queryKey: queryKeys.chain.swapPoolMetadata,
    queryFn: () => readExchangePoolImmutableMetadata(EXCHANGE_CONFIG.pool, readClient),
    enabled: quotesEnabled,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const spotQuery = useQuery({
    queryKey: queryKeys.chain.swapPoolSpot,
    queryFn: () => readExchangePoolSpotPrice(EXCHANGE_CONFIG.pool, readClient),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleInterval(spotQuery, EXCHANGE_CONFIG.quoteRefreshIntervalMs, quotesEnabled)

  const poolContext: ExchangePoolReadContext | undefined =
    metadataQuery.data && spotQuery.data
      ? { pool: metadataQuery.data, spot: spotQuery.data }
      : undefined

  return {
    poolContext,
    metadataQuery,
    spotQuery,
  }
}
