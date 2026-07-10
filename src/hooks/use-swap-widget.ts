import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/views/dapp/web3/thirdweb-react'
import { useCallback, useMemo, useState } from 'react'
import { calcAmountOutMin } from '~/core/swap/calc-amount-out-min'
import { HIGH_SWAP_PRICE_IMPACT_BPS } from '~/core/swap/calc-price-impact-bps'
import {
  canSubmitQuotedSwap,
  resolveLiveQuotedOut,
} from '~/core/swap/resolve-live-quoted-out'
import { formatGasEstimate } from '~/views/dapp/swap/format-gas-estimate'
import { formatSwapRateApprox } from '~/views/dapp/swap/format-swap-rate'
import { resolvePancakeSwapDeepLink } from '~/shared/config/pancake-swap-links'
import {
  clampSlippagePercent,
  formatTokenAmount,
  formatTokenAmountInputDisplay,
  slippagePercentToBps,
} from '~/core/swap/token-amount'
import { getSwapPairTokens } from '~/views/dapp/swap/swap-pair'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { readErc20Allowance, readErc20Balance, fetchSwapQuote, readSwapPoolImmutableMetadata } from '~/views/dapp/web3/swap-read'
import { approveTokenIfNeeded, executeTokenSwap } from '~/views/dapp/web3/swap-write'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { invalidateAfterSwap } from '~/shared/api/query/invalidate'
import { useSwapDirectionStore } from '~/stores/swap-direction-store'
import { GENESIS_PURCHASE_ERROR, SWAP_QUOTE_FAILED } from '~/views/dapp/web3/resolve-contract-error-message'
import { WalletTransactionWaitError } from '~/views/dapp/web3/wait-wallet-transaction'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'
import { useChainReadClient } from '~/hooks/use-chain-read-client'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'

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
  // Clamp here so an out-of-range value can never reach calcAmountOutMin (throws ≥100%).
  const setSlippage = useCallback((value: number) => {
    setSlippageRaw(clampSlippagePercent(value))
  }, [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<unknown>(null)
  /** Blocks re-submit after a pending tx with unknown confirmation outcome. */
  const [blockResubmit, setBlockResubmit] = useState(false)
  const readClient = useChainReadClient()

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

  const poolMetadataQuery = useQuery({
    queryKey: queryKeys.chain.swapPoolMetadata,
    queryFn: () => readSwapPoolImmutableMetadata(SWAP_CONFIG.pool, readClient),
    enabled: quotesEnabled,
    staleTime: Number.POSITIVE_INFINITY,
  })

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
      }),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  const exchangeSpotQuoteInvertedQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      usd1ToUsdtPair.sell.address,
      usd1ToUsdtPair.buy.address,
      exchangeSpotAmountInverted.toString(),
    ),
    queryFn: () =>
      fetchSwapQuote({
        amountIn: exchangeSpotAmountInverted,
        tokenIn: usd1ToUsdtPair.sell.address,
        tokenOut: usd1ToUsdtPair.buy.address,
        client: readClient,
      }),
    enabled: quotesEnabled,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  const sellBalance = balancesQuery.data?.sell ?? 0n
  const buyBalance = balancesQuery.data?.buy ?? 0n
  const balancesLoaded = balancesQuery.data !== undefined

  const {
    amount: sellAmount,
    amountIn,
    setAmount: setSellAmount,
    clearAmount,
    fillPercent: fillSellPercent,
  } = useCappedTokenAmountInput({
    decimals: pair.sell.decimals,
    balance: sellBalance,
    balancesLoaded,
    authenticated,
    onBeforeCap: () => setSubmitError(null),
  })

  const amountQuoteQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      pair.sell.address,
      pair.buy.address,
      amountIn.toString(),
    ),
    queryFn: () =>
      fetchSwapQuote({
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        client: readClient,
      }),
    enabled: quotesEnabled && authenticated && amountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(spotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, quotesEnabled)
  useVisibleQueryInterval(exchangeSpotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, quotesEnabled)
  useVisibleQueryInterval(
    exchangeSpotQuoteInvertedQuery,
    SWAP_CONFIG.quoteRefreshIntervalMs,
    quotesEnabled,
  )
  useVisibleQueryInterval(
    amountQuoteQuery,
    SWAP_CONFIG.quoteRefreshIntervalMs,
    quotesEnabled && authenticated && amountIn > 0n,
  )

  const isBalancesLoading = walletReady && balancesQuery.isLoading
  // keepPreviousData must not drive submit/UI: placeholder is a prior amountIn's quote.
  const amountQuote = amountQuoteQuery.isPlaceholderData ? undefined : amountQuoteQuery.data
  const quotedOut = resolveLiveQuotedOut(
    amountQuoteQuery.isPlaceholderData,
    amountQuoteQuery.data?.quotedOut,
  )
  const priceImpactBps = amountQuote?.priceImpactBps ?? 0
  const gasEstimate = amountQuote?.gasEstimate ?? 0n
  const poolFee = poolMetadataQuery.data?.fee ?? SWAP_CONFIG.feeTier
  const spotQuotedOut = resolveLiveQuotedOut(
    spotQuoteQuery.isPlaceholderData,
    spotQuoteQuery.data?.quotedOut,
  )
  const exchangeSpotQuotedOut = resolveLiveQuotedOut(
    exchangeSpotQuoteQuery.isPlaceholderData,
    exchangeSpotQuoteQuery.data?.quotedOut,
  )
  const exchangeSpotQuotedOutInverted = resolveLiveQuotedOut(
    exchangeSpotQuoteInvertedQuery.isPlaceholderData,
    exchangeSpotQuoteInvertedQuery.data?.quotedOut,
  )
  const isQuoting =
    authenticated &&
    amountIn > 0n &&
    (amountQuoteQuery.isPending ||
      amountQuoteQuery.isPlaceholderData ||
      (amountQuoteQuery.isFetching && quotedOut === 0n))
  const isSpotQuoting =
    amountIn === 0n &&
    (spotQuoteQuery.isPending || spotQuoteQuery.isPlaceholderData) &&
    spotQuotedOut === 0n
  const isExchangePriceQuoting =
    (exchangeSpotQuoteQuery.isPending || exchangeSpotQuoteQuery.isPlaceholderData) &&
    exchangeSpotQuotedOut === 0n
  const isExchangePriceInvertedQuoting =
    (exchangeSpotQuoteInvertedQuery.isPending ||
      exchangeSpotQuoteInvertedQuery.isPlaceholderData) &&
    exchangeSpotQuotedOutInverted === 0n

  const validationError = useMemo(() => {
    if (!amountQuoteQuery.error) return null
    return SWAP_QUOTE_FAILED
  }, [amountQuoteQuery.error])

  const error = submitError ?? validationError

  const routeLabel = useMemo(
    () => `${pair.sell.symbol} → ${pair.buy.symbol}`,
    [pair.buy.symbol, pair.sell.symbol],
  )

  const sellAmountDisplay = useMemo(
    () => formatTokenAmountInputDisplay(sellAmount),
    [sellAmount],
  )

  const buyAmount = useMemo(
    () =>
      authenticated && amountIn > 0n && quotedOut > 0n
        ? formatTokenAmountInputDisplay(formatTokenAmount(quotedOut, pair.buy.decimals, 6))
        : '',
    [authenticated, amountIn, pair.buy.decimals, quotedOut],
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
    if (exchangeSpotQuotedOutInverted === 0n) {
      return isExchangePriceInvertedQuoting ? '' : '—'
    }

    return formatSwapRateApprox({
      amountIn: exchangeSpotAmountInverted,
      amountOut: exchangeSpotQuotedOutInverted,
      decimalsIn: usd1ToUsdtPair.sell.decimals,
      decimalsOut: usd1ToUsdtPair.buy.decimals,
      symbolIn: usd1ToUsdtPair.sell.symbol,
      symbolOut: usd1ToUsdtPair.buy.symbol,
      fractionDigits: 6,
    })
  }, [
    exchangeSpotAmountInverted,
    exchangeSpotQuotedOutInverted,
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
    if (!authenticated || amountIn === 0n || isQuoting) return ''
    return `${(priceImpactBps / 100).toFixed(2)}%`
  }, [amountIn, authenticated, isQuoting, priceImpactBps])

  const gasEstimateLabel = useMemo(
    () => formatGasEstimate(gasEstimate),
    [gasEstimate],
  )

  const isHighPriceImpact =
    authenticated && amountIn > 0n && priceImpactBps >= HIGH_SWAP_PRICE_IMPACT_BPS

  // Single source of truth for the output floor: displayed and executed values
  // always come from this memo, so the on-chain bound matches the UI.
  const amountOutMin = useMemo(
    () => (quotedOut > 0n ? calcAmountOutMin(quotedOut, slippageBps) : 0n),
    [quotedOut, slippageBps],
  )

  const canSubmit = canSubmitQuotedSwap({
    walletReady,
    amountIn,
    sellBalance,
    quotedOut,
    amountOutMin,
    isPlaceholderData: amountQuoteQuery.isPlaceholderData,
    isQuotePending: amountQuoteQuery.isPending,
    isBalancesLoading,
    isSubmitting,
    blockResubmit,
    quoteUpdatedAt: amountQuoteQuery.dataUpdatedAt,
    maxQuoteAgeMs: QUERY_STALE_TIME.quote,
  })

  const setSellAmountAndUnlock = useCallback(
    (value: string) => {
      setBlockResubmit(false)
      setSellAmount(value)
    },
    [setSellAmount],
  )

  const fillPercent = useCallback(
    (percent: number) => {
      if (!walletReady) return
      setBlockResubmit(false)
      fillSellPercent(percent)
    },
    [fillSellPercent, walletReady],
  )

  const flipDirection = useCallback(() => {
    setBlockResubmit(false)
    flipDirectionInStore()
    clearAmount()
  }, [clearAmount, flipDirectionInStore])

  const submit = useCallback(async (): Promise<boolean> => {
    if (!account || !wallet) {
      setSubmitError(GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED)
      return false
    }
    if (!canSubmit) return false

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await approveTokenIfNeeded({
        wallet,
        token: pair.sell.address,
        amountIn,
      })
      await balancesQuery.refetch()

      await executeTokenSwap({
        wallet,
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        amountOutMin,
      })
      setBlockResubmit(false)
      clearAmount()
      invalidateAfterSwap()
      await balancesQuery.refetch()
      return true
    } catch (caught: unknown) {
      if (caught instanceof WalletTransactionWaitError && caught.outcome === 'unknown') {
        setBlockResubmit(true)
      }
      setSubmitError(caught)
      // Refresh balances for display; do not unlock resubmit on unknown outcome.
      void balancesQuery.refetch()
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [
    account,
    amountIn,
    amountOutMin,
    balancesQuery,
    canSubmit,
    clearAmount,
    pair.buy.address,
    pair.sell.address,
    wallet,
  ])

  return {
    sellAmount,
    sellAmountDisplay,
    setSellAmount: setSellAmountAndUnlock,
    direction,
    flipDirection,
    slippage,
    setSlippage,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
    buyAmount,
    exchangePriceLabel,
    exchangePriceLabelInverted,
    routeLabel,
    pancakeSwapUrl,
    poolFee,
    priceImpactLabel,
    gasEstimateLabel,
    isHighPriceImpact,
    walletReady,
    canSubmit,
    isQuoting,
    isSpotQuoting,
    isExchangePriceQuoting,
    isExchangePriceInvertedQuoting,
    isBalancesLoading,
    isSubmitting,
    error,
    fillPercent,
    submit,
    amountOutMin,
  }
}
