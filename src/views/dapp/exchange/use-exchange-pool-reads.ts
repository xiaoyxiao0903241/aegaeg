import { keepPreviousData } from '@tanstack/react-query'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { ExchangePoolReadContext } from '~/web3/exchange/exchange-read'
import {
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
} from '~/web3/exchange/read-exchange-pool'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useChainQuery } from '~/hooks/use-chain-query'

/** Shared V2 pair metadata + reserves — short-stale spot reused across exchange quotes. */
export function useExchangePoolReads(quotesEnabled = true) {
  const metadataQuery = useChainQuery({
    queryKey: queryKeys.chain.swapPoolMetadata,
    queryFn: () => readExchangePoolImmutableMetadata(EXCHANGE_CONFIG.pool),
    scope: 'public',
    freshness: 'static',
    enabled: quotesEnabled,
  })

  const spotQuery = useChainQuery({
    queryKey: queryKeys.chain.swapPoolSpot,
    queryFn: () => readExchangePoolSpotPrice(EXCHANGE_CONFIG.pool),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled,
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
