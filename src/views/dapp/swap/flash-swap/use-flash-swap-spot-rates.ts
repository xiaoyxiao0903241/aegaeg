import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  formatSwapRate,
  formatSwapRateColon,
  resolveEmptySpotRatePlaceholder,
} from '~/views/dapp/swap/swap-format-rate'
import type { SwapPairTokens } from '~/views/dapp/swap/swap-pair'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { resolveLiveQuotedOut } from '~/core/swap/resolve-live-quoted-out'
import { readFlashSwapQuote } from '~/web3/swap/flash-swap-read'

/** Fixed 10^decimals spot quote for flash exchange / overview rate labels. */
export function useFlashSwapSpotRates({
  pair,
  quotesEnabled,
}: {
  pair: SwapPairTokens
  quotesEnabled: boolean
}) {
  const readClient = useChainReadClient()
  const spotQuoteAmount = 10n ** BigInt(pair.sell.decimals)

  const spotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapQuote(spotQuoteAmount.toString()),
    queryFn: () => readFlashSwapQuote(spotQuoteAmount, readClient),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleInterval(spotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, quotesEnabled)

  const spotQuotedOut = resolveLiveQuotedOut(
    spotQuoteQuery.isPlaceholderData,
    spotQuoteQuery.data,
  )
  const isExchangePriceQuoting =
    spotQuoteQuery.isPending ||
    spotQuoteQuery.isPlaceholderData ||
    (spotQuoteQuery.isFetching && spotQuotedOut === 0n)

  const exchangePriceEmpty = resolveEmptySpotRatePlaceholder(
    spotQuotedOut,
    isExchangePriceQuoting,
  )
  const exchangePriceLabel =
    exchangePriceEmpty !== null
      ? exchangePriceEmpty
      : formatSwapRate({
          amountIn: spotQuoteAmount,
          amountOut: spotQuotedOut,
          decimalsIn: pair.sell.decimals,
          decimalsOut: pair.buy.decimals,
          symbolIn: pair.sell.symbol,
          symbolOut: pair.buy.symbol,
          fractionDigits: 6,
        })

  const overviewRateLabel =
    exchangePriceEmpty !== null
      ? exchangePriceEmpty
      : formatSwapRateColon({
          amountIn: spotQuoteAmount,
          amountOut: spotQuotedOut,
          decimalsIn: pair.sell.decimals,
          decimalsOut: pair.buy.decimals,
        })

  return {
    exchangePriceLabel,
    overviewRateLabel,
    isExchangePriceQuoting,
  }
}
