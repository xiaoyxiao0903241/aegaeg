import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useMemo, useState } from 'react'
import { HIGH_SWAP_PRICE_IMPACT_BPS } from '~/core/swap/calc-price-impact-bps'
import { resolveLiveQuotedOut } from '~/core/swap/resolve-live-quoted-out'
import { formatGasEstimate } from '~/views/dapp/swap/format-gas-estimate'
import { formatSwapRateApprox } from '~/views/dapp/swap/format-swap-rate'
import { resolvePancakeSwapDeepLink } from '~/shared/config/pancake-swap-links'
import {
  clampSlippagePercent,
  formatTokenAmount,
  slippagePercentToBps,
} from '~/core/swap/token-amount'
import { getSwapPairTokens } from '~/views/dapp/swap/swap-pair'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { readErc20Balance, readErc20Allowance, fetchSwapQuote } from '~/views/dapp/web3/swap-read'
import { approveTokenIfNeeded, executeTokenSwap } from '~/views/dapp/web3/swap-write'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { invalidateAfterSwap } from '~/shared/api/query/invalidate'
import { useSwapDirectionStore } from '~/stores/swap-direction-store'
import { GENESIS_PURCHASE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'
import { useChainReadClient } from '~/hooks/use-chain-read-client'
import { useQuotedSwapCore } from '~/hooks/use-quoted-swap-core'
import { useSwapPoolReads } from '~/hooks/queries/use-swap-pool-reads'

/**
 * @param authenticated — SIWE session ready; gates quotes, swap submit, and amount capping.
 * Balances load on wallet account presence (`walletReady`), independent of SIWE.
 */
export function useSwapWidget(authenticated: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const direction = useSwapDirectionStore((state) => state.direction)
  const flipDirectionInStore = useSwapDirectionStore((state) => state.flipDirection)
  const [slippage, setSlippageRaw] = useState(1)
  const setSlippage = useCallback((value: number) => {
    setSlippageRaw(clampSlippagePercent(value))
  }, [])
  const readClient = useChainReadClient()
  const { poolContext, poolFee } = useSwapPoolReads(quotesEnabled)

  const pair = useMemo(() => getSwapPairTokens(direction), [direction])
  const usdtToUsd1Pair = useMemo(() => getSwapPairTokens('reverse'), [])
  const usd1ToUsdtPair = useMemo(() => getSwapPairTokens('forward'), [])
  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const slippageBps = slippagePercentToBps(slippage)
  const spotQuoteAmount = useMemo(
    () => 10n ** BigInt(pair.sell.decimals),
    [pair.sell.decimals],
  )
  const exchangeSpotAmount = useMemo(
    () => 10n ** BigInt(usdtToUsd1Pair.sell.decimals),
    [usdtToUsd1Pair.sell.decimals],
  )
  const exchangeSpotAmountInverted = useMemo(
    () => 10n ** BigInt(usd1ToUsdtPair.sell.decimals),
    [usd1ToUsdtPair.sell.decimals],
  )

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.swapBalances(
      address ?? '',
      pair.sell.address,
      pair.buy.address,
    ),
    queryFn: async () => {
      const [sell, buy, approved] = await Promise.all([
        readErc20Balance(pair.sell.address, address!, readClient),
        readErc20Balance(pair.buy.address, address!, readClient),
        readErc20Allowance(pair.sell.address, address!, SWAP_CONFIG.router, readClient),
      ])
      return { sell, buy, approved }
    },
    enabled: quotesEnabled && walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  const fetchTradeQuote = useCallback(
    (amountIn: bigint) =>
      fetchSwapQuote({
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        client: readClient,
        poolContext,
      }),
    [pair.buy.address, pair.sell.address, poolContext, readClient],
  )

  const sellBalance = balancesQuery.data?.sell ?? 0n
  const buyBalance = balancesQuery.data?.buy ?? 0n
  const balancesLoaded = balancesQuery.data !== undefined
  const allowance = balancesQuery.data?.approved ?? 0n
  const isBalancesLoading = walletReady && balancesQuery.isLoading

  const core = useQuotedSwapCore({
    authenticated,
    quotesEnabled,
    decimals: pair.sell.decimals,
    buyDecimals: pair.buy.decimals,
    sellBalance,
    allowance,
    balancesLoaded,
    walletReady,
    isBalancesLoading,
    slippageBps,
    quoteRefreshIntervalMs: SWAP_CONFIG.quoteRefreshIntervalMs,
    getQuoteQueryKey: (amountIn) =>
      queryKeys.chain.swapQuote(
        pair.sell.address,
        pair.buy.address,
        amountIn.toString(),
      ),
    fetchQuote: fetchTradeQuote,
    selectQuotedOut: (quote) => quote?.quotedOut ?? 0n,
  })

  const { amountIn, amountQuoteQuery } = core

  const spotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      pair.sell.address,
      pair.buy.address,
      spotQuoteAmount.toString(),
    ),
    queryFn: () =>
      fetchSwapQuote({
        amountIn: spotQuoteAmount,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        client: readClient,
        poolContext,
      }),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  const exchangeSpotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      usdtToUsd1Pair.sell.address,
      usdtToUsd1Pair.buy.address,
      exchangeSpotAmount.toString(),
    ),
    queryFn: () =>
      fetchSwapQuote({
        amountIn: exchangeSpotAmount,
        tokenIn: usdtToUsd1Pair.sell.address,
        tokenOut: usdtToUsd1Pair.buy.address,
        client: readClient,
        poolContext,
      }),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(spotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, quotesEnabled)
  useVisibleQueryInterval(exchangeSpotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, quotesEnabled)

  const amountQuote = amountQuoteQuery.isPlaceholderData
    ? undefined
    : amountQuoteQuery.data
  const priceImpactBps = amountQuote?.priceImpactBps ?? 0
  const gasEstimate = amountQuote?.gasEstimate ?? 0n
  const spotQuotedOut = resolveLiveQuotedOut(
    spotQuoteQuery.isPlaceholderData,
    spotQuoteQuery.data?.quotedOut,
  )
  const exchangeSpotQuotedOut = resolveLiveQuotedOut(
    exchangeSpotQuoteQuery.isPlaceholderData,
    exchangeSpotQuoteQuery.data?.quotedOut,
  )
  const isSpotQuoting =
    amountIn === 0n &&
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) &&
    spotQuotedOut === 0n
  const isExchangePriceQuoting =
    (exchangeSpotQuoteQuery.isPending || exchangeSpotQuoteQuery.isPlaceholderData) &&
    exchangeSpotQuotedOut === 0n
  /** 反方向汇率由正向 quote 反推，不再单独轮询。 */
  const isExchangePriceInvertedQuoting = isExchangePriceQuoting

  const routeLabel = useMemo(
    () => `${pair.sell.symbol} → ${pair.buy.symbol}`,
    [pair.buy.symbol, pair.sell.symbol],
  )

  const exchangePriceLabel = useMemo(() => {
    if (exchangeSpotQuotedOut === 0n) {
      return isExchangePriceQuoting ? '' : '—'
    }

    return formatSwapRateApprox({
      amountIn: exchangeSpotAmount,
      amountOut: exchangeSpotQuotedOut,
      decimalsIn: usdtToUsd1Pair.sell.decimals,
      decimalsOut: usdtToUsd1Pair.buy.decimals,
      symbolIn: usdtToUsd1Pair.sell.symbol,
      symbolOut: usdtToUsd1Pair.buy.symbol,
      fractionDigits: 6,
    })
  }, [
    exchangeSpotAmount,
    exchangeSpotQuotedOut,
    isExchangePriceQuoting,
    usdtToUsd1Pair.buy.decimals,
    usdtToUsd1Pair.buy.symbol,
    usdtToUsd1Pair.sell.decimals,
    usdtToUsd1Pair.sell.symbol,
  ])

  const exchangePriceLabelInverted = useMemo(() => {
    if (exchangeSpotQuotedOut === 0n) {
      return isExchangePriceInvertedQuoting ? '' : '—'
    }
    const amountOut =
      (exchangeSpotAmountInverted * exchangeSpotAmount) / exchangeSpotQuotedOut
    if (amountOut === 0n) return '—'

    return formatSwapRateApprox({
      amountIn: exchangeSpotAmountInverted,
      amountOut,
      decimalsIn: usd1ToUsdtPair.sell.decimals,
      decimalsOut: usd1ToUsdtPair.buy.decimals,
      symbolIn: usd1ToUsdtPair.sell.symbol,
      symbolOut: usd1ToUsdtPair.buy.symbol,
      fractionDigits: 6,
    })
  }, [
    exchangeSpotAmount,
    exchangeSpotAmountInverted,
    exchangeSpotQuotedOut,
    isExchangePriceInvertedQuoting,
    usd1ToUsdtPair.buy.decimals,
    usd1ToUsdtPair.buy.symbol,
    usd1ToUsdtPair.sell.decimals,
    usd1ToUsdtPair.sell.symbol,
  ])

  const pancakeSwapUrl = useMemo(
    () => resolvePancakeSwapDeepLink(pair.sell.symbol, pair.buy.symbol),
    [pair.buy.symbol, pair.sell.symbol],
  )

  const priceImpactLabel = useMemo(() => {
    if (!authenticated || core.amountIn === 0n || core.isQuoting) return ''
    return `${(priceImpactBps / 100).toFixed(2)}%`
  }, [authenticated, core.amountIn, core.isQuoting, priceImpactBps])

  const gasEstimateLabel = useMemo(
    () => formatGasEstimate(gasEstimate),
    [gasEstimate],
  )

  const isHighPriceImpact =
    authenticated && core.amountIn > 0n && priceImpactBps >= HIGH_SWAP_PRICE_IMPACT_BPS

  const flipDirection = useCallback(() => {
    core.setBlockResubmit(false)
    flipDirectionInStore()
    core.clearAmount()
  }, [core, flipDirectionInStore])

  const submit = useCallback(async (): Promise<
    { ok: true } | { ok: false; error: unknown | null }
  > => {
    if (!account || !wallet) {
      const error = GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED
      core.setSubmitError(error)
      return { ok: false, error }
    }

    const result = await core.runQuotedSubmit(async ({ assertStillSubmittable }) => {
      await approveTokenIfNeeded({
        wallet,
        token: pair.sell.address,
        amountIn: core.debouncedAmountIn,
      })
      await balancesQuery.refetch()
      assertStillSubmittable()

      await executeTokenSwap({
        wallet,
        amountIn: core.debouncedAmountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        amountOutMin: core.amountOutMin,
      })
      invalidateAfterSwap()
      await balancesQuery.refetch()
    })
    if (result.ok) return { ok: true }
    return { ok: false, error: result.error }
  }, [
    account,
    balancesQuery,
    core,
    pair.buy.address,
    pair.sell.address,
    wallet,
  ])

  return {
    sellAmount: core.sellAmount,
    sellAmountDisplay: core.sellAmountDisplay,
    setSellAmount: core.setSellAmount,
    direction,
    flipDirection,
    slippage,
    setSlippage,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
    buyAmount: core.buyAmount,
    exchangePriceLabel,
    exchangePriceLabelInverted,
    routeLabel,
    pancakeSwapUrl,
    poolFee,
    priceImpactLabel,
    gasEstimateLabel,
    isHighPriceImpact,
    walletReady,
    canSubmit: core.canSubmit,
    needsMaxApproval: core.needsMaxApproval,
    isQuoting: core.isQuoting,
    isSpotQuoting,
    isExchangePriceQuoting,
    isExchangePriceInvertedQuoting,
    isBalancesLoading,
    isSubmitting: core.isSubmitting,
    error: core.error,
    validationError: core.validationError,
    quoteErrorUpdatedAt: core.quoteErrorUpdatedAt,
    fillPercent: core.fillPercent,
    submit,
    amountOutMin: core.amountOutMin,
  }
}
