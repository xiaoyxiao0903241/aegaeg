import { keepPreviousData } from '@tanstack/react-query'

import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { ExchangePoolReadContext } from '~/web3/exchange/exchange-read'
import {
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
} from '~/web3/exchange/read-exchange-pool'

/**
 * Shared V2 pair metadata + reserves.
 * `readsEnabled` warms cache on Exchange tab; `spotLive` polls only for the active Trade view.
 */
export function useExchangePoolReads(readsEnabled = true, spotLive = readsEnabled) {
  const metadataQuery = useChainQuery({
    queryKey: queryKeys.chain.swapPoolMetadata,
    queryFn: () => readExchangePoolImmutableMetadata(EXCHANGE_CONFIG.pool),
    scope: 'public',
    freshness: 'static',
    enabled: readsEnabled,
  })

  const spotQuery = useChainQuery({
    queryKey: queryKeys.chain.swapPoolSpot,
    queryFn: () => readExchangePoolSpotPrice(EXCHANGE_CONFIG.pool),
    scope: 'public',
    freshness: 'quote',
    enabled: readsEnabled,
    refetchInterval: spotLive ? EXCHANGE_CONFIG.quoteRefreshIntervalMs : false,
    placeholderData: keepPreviousData,
  })

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
