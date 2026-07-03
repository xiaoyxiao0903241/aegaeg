import { useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { SWAP_CONFIG } from '~/config/swap'
import { formatSwapRateColon } from '~/lib/swap/format-swap-rate'
import { getSwapPairTokens, type SwapDirection } from '~/lib/swap/swap-pair'
import { QUERY_STALE_TIME } from '~/lib/query/query-client'
import { queryKeys } from '~/lib/query/query-keys'
import { fetchSwapQuote } from '~/web3/swap-read'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'
import { useChainReadClient } from '~/hooks/use-chain-read-client'

export function usePairSpotRate(
  enabled = true,
  direction: SwapDirection = 'reverse',
  intervalMs = SWAP_CONFIG.spotRateRefreshIntervalMs,
) {
  const readClient = useChainReadClient()
  const pair = useMemo(
    () => getSwapPairTokens(direction === 'reverse' ? 'reverse' : 'forward'),
    [direction],
  )
  const spotAmount = useMemo(
    () => 10n ** BigInt(pair.sell.decimals),
    [pair.sell.decimals],
  )

  const spotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      pair.sell.address,
      pair.buy.address,
      spotAmount.toString(),
    ),
    queryFn: () =>
      fetchSwapQuote({
        amountIn: spotAmount,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        client: readClient,
      }),
    enabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(spotQuoteQuery, intervalMs, enabled)

  const rateLabel = useMemo(() => {
    const quotedOut = spotQuoteQuery.data?.quotedOut ?? 0n
    if (quotedOut === 0n) return null

    return formatSwapRateColon({
      amountIn: spotAmount,
      amountOut: quotedOut,
      decimalsIn: pair.sell.decimals,
      decimalsOut: pair.buy.decimals,
    })
  }, [
    pair.buy.decimals,
    pair.sell.decimals,
    spotAmount,
    spotQuoteQuery.data?.quotedOut,
  ])

  return {
    rateLabel,
    isLoading: spotQuoteQuery.isPending,
  }
}
