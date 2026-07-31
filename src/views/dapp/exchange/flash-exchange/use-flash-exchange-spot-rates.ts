import { keepPreviousData } from '@tanstack/react-query'
import {
  formatExchangeRateColon,
  emptySpotRateDash,
} from '~/views/dapp/exchange/exchange-format-rate'
import type { ExchangePairTokens, FlashPairId } from '~/views/dapp/exchange/exchange-pair'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useChainQuery } from '~/hooks/use-chain-query'
import { resolveLiveQuotedOut } from '~/core/exchange/resolve-live-quoted-out'
import { readFlashPairQuote } from '~/web3/exchange/flash-exchange-read'

/** Fixed 10^decimals spot quote for flash exchange / overview rate labels. */
export function useFlashExchangeSpotRates({
  pairId,
  direction,
  pair,
  quotesEnabled,
}: {
  pairId: FlashPairId
  direction: ExchangeDirection
  pair: ExchangePairTokens
  quotesEnabled: boolean
}) {
  const spotQuoteAmount = 10n ** BigInt(pair.sell.decimals)

  const spotQuoteQuery = useChainQuery({
    queryKey: queryKeys.chain.flashSwapQuote(pairId, direction, spotQuoteAmount.toString()),
    queryFn: () => readFlashPairQuote(pairId, spotQuoteAmount),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled,
    placeholderData: keepPreviousData,
  })

  useVisibleInterval(spotQuoteQuery, EXCHANGE_CONFIG.quoteRefreshIntervalMs, quotesEnabled)

  const spotQuotedOut = resolveLiveQuotedOut(spotQuoteQuery.isPlaceholderData, spotQuoteQuery.data)
  const isExchangePriceQuoting =
    pairId === 'gagx'
      ? false
      : spotQuoteQuery.isPending ||
        spotQuoteQuery.isPlaceholderData ||
        (spotQuoteQuery.isFetching && spotQuotedOut === 0n)

  const exchangePriceEmpty = emptySpotRateDash(spotQuotedOut, isExchangePriceQuoting)
  // Figma flash meta + overview both use colon form (`1 : 1`), not `1 TOKEN = …`.
  const rateLabel =
    exchangePriceEmpty !== null
      ? exchangePriceEmpty
      : formatExchangeRateColon({
          amountIn: spotQuoteAmount,
          amountOut: spotQuotedOut,
          decimalsIn: pair.sell.decimals,
          decimalsOut: pair.buy.decimals,
        })

  return {
    exchangePriceLabel: rateLabel,
    overviewRateLabel: rateLabel,
    isExchangePriceQuoting,
  }
}
