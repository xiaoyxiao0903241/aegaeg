import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { SWAP_CONFIG } from '~/config/swap'
import { QUERY_STALE_TIME } from '~/lib/query/query-client'
import { queryKeys } from '~/lib/query/query-keys'
import type { SwapDirection } from '~/lib/swap/swap-pair'
import { readPairSpotRate } from '~/web3/swap-read'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'

function formatPoolRateLabel(
  rate: { usd1PerXx: number; xxPerUsd1: number },
  direction: SwapDirection,
) {
  return direction === 'reverse'
    ? `1 USDT ≈ ${rate.usd1PerXx.toFixed(2)} USD1`
    : `1 USD1 ≈ ${rate.xxPerUsd1.toFixed(2)} USDT`
}

export function usePairSpotRate(
  enabled = true,
  direction: SwapDirection = 'reverse',
  intervalMs = SWAP_CONFIG.spotRateRefreshIntervalMs,
) {
  const spotRateQuery = useQuery({
    queryKey: queryKeys.chain.pairSpotRate,
    queryFn: () => readPairSpotRate(),
    enabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(spotRateQuery, intervalMs, enabled)

  const rateLabel = spotRateQuery.data ? formatPoolRateLabel(spotRateQuery.data, direction) : null

  return {
    rateLabel,
    isLoading: spotRateQuery.isPending,
  }
}
