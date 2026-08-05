import { keepPreviousData } from '@tanstack/react-query'

import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import {
  emptySpotRateDash,
  type ExchangePairTokens,
  type FlashPairId,
  formatExchangeRateColon,
} from '~/views/dapp/exchange/shared'
import { readFlashPairQuote } from '~/web3/exchange/flash-exchange-read'

/** 闪电兑换行情：固定 1 单位卖出币的链上报价，供面板与概览汇率标签使用。 */
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
    // gAGX 无实时行情池，只做一次性读取
    refetchInterval: pairId === 'gagx' ? false : EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    placeholderData: keepPreviousData,
  })

  const spotQuotedOut = spotQuoteQuery.data ?? 0n
  const isExchangePriceQuoting =
    pairId === 'gagx'
      ? false
      : (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) && spotQuotedOut === 0n

  const exchangePriceEmpty = emptySpotRateDash(spotQuotedOut)
  // 面板与概览统一用冒号形式（`1 : 1`），不用 `1 TOKEN = …` 形式
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
