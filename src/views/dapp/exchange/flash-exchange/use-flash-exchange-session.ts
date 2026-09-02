import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'

import { ZERO_BI } from '~/core/constants'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import { evaluateFlashUsd1Swap } from '~/core/exchange/flash-usd1-swap'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useExchangeFlashPairStore } from '~/stores/exchange-flash-pair-store'
import { submitFlashExchange } from '~/views/dapp/exchange/flash-exchange/submit-flash-exchange'
import { useFlashExchangeSpotRates } from '~/views/dapp/exchange/flash-exchange/use-flash-exchange-spot-rates'
import {
  type ExchangeSubmitResult,
  flashPairAllowsFlip,
  getFlashExchangePairTokens,
  isFlashPairId,
} from '~/views/dapp/exchange/shared'
import { useExchangeQuote } from '~/views/dapp/exchange/use-exchange-quote'
import {
  readFlashPairBalances,
  readFlashPairQuote,
  readUsd1SwapConfig,
} from '~/web3/exchange/flash-exchange-read'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

/**
 * USDT 兑换滑点 1%（合约示例 minOut 取 99%）；gAGX 包装 / 赎回为 1:1，无滑点。
 *
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
const FLASH_USDT_SLIPPAGE_BPS = 100

/** 双币对闪兑：gAGX→AGX 赎回 + USDT→USD1，双向金额输入，无滑点设置项。 */
type FlashIntroKey = 'gagx' | 'gagxWrap' | 'usdt'

/**
 * 闪电兑换会话状态
 *
 * 管理币对、方向、余额 / 授权、报价与提交；两对均为单向，
 * USDT 对需等链上配置就绪后才开启报价。
 */
export function useFlashExchangeSession(
  sessionReady: boolean,
  quotesEnabled = true,
  readsEnabled = quotesEnabled,
) {
  const { walletReady, writeReady } = useWriteReadiness()
  const pairId = useExchangeFlashPairStore((s) => s.pairId)
  const setPairIdStore = useExchangeFlashPairStore((s) => s.setPairId)
  const [direction, setDirection] = useState<ExchangeDirection>('forward')
  const pair = getFlashExchangePairTokens(pairId, direction)
  const isRedeemPair = pairId === 'gagx'

  // 闪兑会话挂载即预热配置，而非只在切到 USDT 段时读取
  const configQuery = useChainQuery({
    queryKey: queryKeys.chain.flashUsd1SwapConfig,
    queryFn: () => readUsd1SwapConfig(),
    scope: 'public',
    freshness: 'quote',
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  // 不写死输入 / 输出小数位，等链上配置返回 usdtDec / usd1Dec
  const usd1ConfigReady = isRedeemPair || configQuery.data !== undefined
  const usdtQuotesEnabled = quotesEnabled && usd1ConfigReady

  const sellDecimals =
    !isRedeemPair && configQuery.data ? configQuery.data.usdtDec : pair.sell.decimals
  const buyDecimals =
    !isRedeemPair && configQuery.data ? configQuery.data.usd1Dec : pair.buy.decimals

  // 三个方向的余额查询常驻预热；跨币对复用旧值会显示错误代币
  const gagxForwardBalances = useChainQuery({
    queryKey: queryKeys.chain.flashSwapBalances('gagx', 'forward'),
    queryFn: (addr) => readFlashPairBalances('gagx', 'forward', addr),
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })
  const gagxReverseBalances = useChainQuery({
    queryKey: queryKeys.chain.flashSwapBalances('gagx', 'reverse'),
    queryFn: (addr) => readFlashPairBalances('gagx', 'reverse', addr),
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })
  const usdtBalances = useChainQuery({
    queryKey: queryKeys.chain.flashSwapBalances('usdt', 'forward'),
    queryFn: (addr) => readFlashPairBalances('usdt', 'forward', addr),
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  const balancesQuery =
    pairId === 'usdt'
      ? usdtBalances
      : direction === 'forward'
        ? gagxForwardBalances
        : gagxReverseBalances

  const sellBalance =
    decisionBigint(balancesQuery.data?.sell, balancesQuery.isPlaceholderData) ?? ZERO_BI
  const allowance =
    decisionBigint(balancesQuery.data?.approved, balancesQuery.isPlaceholderData) ?? ZERO_BI
  const balancesLoaded =
    isDecisionFresh(balancesQuery.isPlaceholderData, balancesQuery.data) && usd1ConfigReady
  const isBalancesLoading =
    walletReady &&
    (!balancesLoaded ||
      balancesQuery.isLoading ||
      (!isRedeemPair && configQuery.data === undefined && !configQuery.isError))

  const core = useExchangeQuote({
    sessionReady,
    quotesEnabled: usdtQuotesEnabled,
    decimals: sellDecimals,
    buyDecimals,
    sellBalance,
    allowance,
    balancesLoaded,
    walletReady,
    writeReady,
    isBalancesLoading,
    slippageBps: isRedeemPair ? 0 : FLASH_USDT_SLIPPAGE_BPS,
    quoteRefreshIntervalMs: EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    getQuoteQueryKey: (amountIn) =>
      queryKeys.chain.flashSwapQuote(pairId, direction, amountIn.toString()),
    fetchQuote: (amountIn) => readFlashPairQuote(pairId, amountIn),
    selectQuotedOut: (quote) => quote ?? ZERO_BI,
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
    setPairIdStore(next)
  }

  function flipDirection() {
    if (!flashPairAllowsFlip(pairId) || core.isSubmitting) return
    core.clearAmount()
    setDirection((prev) => (prev === 'forward' ? 'reverse' : 'forward'))
  }

  async function submit(): Promise<ExchangeSubmitResult> {
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
    // 未加载返回空串，由 CountValue 保留占位；缺失的币对数据不强行归零
    sellBalanceLabel:
      balancesQuery.data === undefined
        ? ''
        : formatTokenAmount(balancesQuery.data.sell, sellDecimals, 4),
    buyBalanceLabel:
      balancesQuery.data === undefined
        ? ''
        : formatTokenAmount(balancesQuery.data.buy, buyDecimals, 4),
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
