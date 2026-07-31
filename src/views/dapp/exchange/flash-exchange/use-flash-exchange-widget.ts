import { useState } from 'react'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import {
  FLASH_PAIR_DEFAULT,
  flashPairAllowsFlip,
  getFlashExchangePairTokens,
  isFlashPairId,
  type FlashPairId,
} from '~/views/dapp/exchange/exchange-pair'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useExchangeQuote } from '~/views/dapp/exchange/use-exchange-quote'
import {
  readFlashPairBalances,
  readFlashPairQuote,
  readUsd1SwapConfig,
} from '~/web3/exchange/flash-exchange-read'
import { useFlashExchangeSpotRates } from '~/views/dapp/exchange/flash-exchange/use-flash-exchange-spot-rates'
import { submitFlashExchange } from '~/views/dapp/exchange/flash-exchange/submit-flash-exchange'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { evaluateFlashUsd1Swap } from '~/core/exchange/flash-usd1-swap'
import { useChainQuery } from '~/hooks/use-chain-query'

/**
 * Handbook `usd1swap.md` sample: `minOut = (usd1Out * 99n) / 100n` (1% floor).
 * Wrap/redeem is protocol 1:1 → 0 bps.
 */
const FLASH_USDT_SLIPPAGE_BPS = 100

/** Dual-pair Flash: gAGX wrap↔redeem + USDT→USD1; dual amount fields; no slippage UI. */
type FlashIntroKey = 'gagx' | 'gagxWrap' | 'usdt'

export function useFlashExchangeWidget(sessionReady: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const [pairId, setPairIdState] = useState<FlashPairId>(FLASH_PAIR_DEFAULT)
  const [direction, setDirection] = useState<ExchangeDirection>('forward')
  const pair = getFlashExchangePairTokens(pairId, direction)
  const isRedeemPair = pairId === 'gagx'

  const walletReady = hasWalletAccount(account)

  const configQuery = useChainQuery({
    queryKey: queryKeys.chain.flashUsd1SwapConfig,
    queryFn: () => readUsd1SwapConfig(),
    scope: 'public',
    freshness: 'quote',
    enabled: quotesEnabled && !isRedeemPair,
  })

  // Handbook: never hardcode input/output decimals — wait for getConfig.usdtDec/usd1Dec.
  const usd1ConfigReady = isRedeemPair || configQuery.data !== undefined
  const usdtQuotesEnabled = quotesEnabled && usd1ConfigReady

  const sellDecimals =
    !isRedeemPair && configQuery.data ? configQuery.data.usdtDec : pair.sell.decimals
  const buyDecimals =
    !isRedeemPair && configQuery.data ? configQuery.data.usd1Dec : pair.buy.decimals

  const balancesQuery = useChainQuery({
    queryKey: queryKeys.chain.flashSwapBalances(pairId, direction),
    queryFn: (addr) => readFlashPairBalances(pairId, direction, addr),
    enabled: quotesEnabled,
  })

  const sellBalance = balancesQuery.data?.sell ?? 0n
  const buyBalance = balancesQuery.data?.buy ?? 0n
  const balancesLoaded = balancesQuery.data !== undefined && usd1ConfigReady
  const isBalancesLoading =
    walletReady &&
    (balancesQuery.isLoading ||
      (!isRedeemPair && configQuery.data === undefined && !configQuery.isError))

  const core = useExchangeQuote({
    sessionReady,
    quotesEnabled: usdtQuotesEnabled,
    decimals: sellDecimals,
    buyDecimals,
    sellBalance,
    allowance: balancesQuery.data?.approved ?? 0n,
    balancesLoaded,
    walletReady,
    writeReady,
    isBalancesLoading,
    slippageBps: isRedeemPair ? 0 : FLASH_USDT_SLIPPAGE_BPS,
    quoteRefreshIntervalMs: EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    getQuoteQueryKey: (amountIn) =>
      queryKeys.chain.flashSwapQuote(pairId, direction, amountIn.toString()),
    fetchQuote: (amountIn) => readFlashPairQuote(pairId, amountIn),
    selectQuotedOut: (quote) => quote ?? 0n,
  })

  const spot = useFlashExchangeSpotRates({
    pairId,
    direction,
    pair: {
      sell: { ...pair.sell, decimals: sellDecimals },
      buy: { ...pair.buy, decimals: buyDecimals },
    },
    quotesEnabled: usdtQuotesEnabled,
  })

  const routeLabel = `${pair.sell.symbol} → ${pair.buy.symbol}`
  const providerAddress = isRedeemPair ? BSC_CONTRACTS.gagx : BSC_CONTRACTS.usd1Swap

  const usd1Block = isRedeemPair
    ? null
    : evaluateFlashUsd1Swap({
        amountIn: core.debouncedAmountIn,
        quotedOut: core.quotedOut,
        config: configQuery.data,
      })

  const canSubmit =
    core.canSubmit && (isRedeemPair || configQuery.data !== undefined) && usd1Block == null

  function setPairId(next: string) {
    if (!isFlashPairId(next) || next === pairId) return
    core.clearAmount()
    setDirection('forward')
    setPairIdState(next)
  }

  function flipDirection() {
    if (!flashPairAllowsFlip(pairId) || core.isSubmitting) return
    core.clearAmount()
    setDirection((prev) => (prev === 'forward' ? 'reverse' : 'forward'))
  }

  async function submit(): Promise<{ ok: true } | { ok: false; error: unknown }> {
    return submitFlashExchange({
      pairId,
      direction,
      core,
    })
  }

  const introKey: FlashIntroKey =
    pairId === 'usdt' ? 'usdt' : direction === 'forward' ? 'gagx' : 'gagxWrap'

  return {
    pairId,
    setPairId,
    flipDirection,
    canFlip: flashPairAllowsFlip(pairId),
    introKey,
    sellAmount: core.sellAmount,
    sellAmountDisplay: core.sellAmountDisplay,
    setSellAmount: core.setSellAmount,
    pair: {
      sell: { ...pair.sell, decimals: sellDecimals },
      buy: { ...pair.buy, decimals: buyDecimals },
    },
    sellBalanceLabel: formatTokenAmount(sellBalance, sellDecimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, buyDecimals, 4),
    buyAmount: core.buyAmount,
    exchangePriceLabel: spot.exchangePriceLabel,
    routeLabel,
    overviewRateLabel: spot.overviewRateLabel,
    providerAddress,
    usd1Block,
    walletReady,
    canSubmit,
    isQuoting: core.isQuoting,
    isExchangePriceQuoting: spot.isExchangePriceQuoting,
    isBalancesLoading,
    isSubmitting: core.isSubmitting,
    error: core.error,
    validationError: core.validationError,
    quoteErrorUpdatedAt: core.quoteErrorUpdatedAt,
    fillPercent: core.fillPercent,
    submit,
  }
}
