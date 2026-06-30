import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { calcAmountOutMin } from '~/lib/swap/calc-amount-out-min'
import { formatSwapRateApprox } from '~/lib/swap/format-swap-rate'
import { resolvePancakeSwapDeepLink } from '~/config/pancake-swap-links'
import {
  capTokenAmountInput,
  formatTokenAmount,
  formatTokenAmountInputDisplay,
  parseTokenAmount,
  sanitizeTokenAmountInput,
  slippagePercentToBps,
} from '~/lib/swap/token-amount'
import { getSwapPairTokens } from '~/lib/swap/swap-pair'
import { SWAP_CONFIG } from '~/config/swap'
import { readErc20Allowance, readErc20Balance, fetchSwapQuote } from '~/web3/swap-read'
import { approveTokenIfNeeded, executeTokenSwap } from '~/web3/swap-write'
import { QUERY_STALE_TIME } from '~/lib/query/query-client'
import { queryKeys } from '~/lib/query/query-keys'
import { useDappActions } from '~/stores/dapp-actions'
import { useSwapDirectionStore } from '~/stores/swap-direction-store'
import { GENESIS_PURCHASE_ERROR } from '~/lib/web3/resolve-contract-error-message'
import { hasWalletAccount } from '~/lib/web3/wallet-connection-state'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'

/**
 * @param authenticated — SIWE session ready; gates quotes, swap submit, and amount capping.
 * Balances load on wallet account presence (`walletReady`), independent of SIWE.
 */
export function useSwapWidget(authenticated: boolean) {
  const account = useActiveAccount()
  const afterSwap = useDappActions((state) => state.afterSwap)
  const direction = useSwapDirectionStore((state) => state.direction)
  const flipDirectionInStore = useSwapDirectionStore((state) => state.flipDirection)
  const [sellAmount, setSellAmountRaw] = useState('')
  const [slippage, setSlippage] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pair = useMemo(() => getSwapPairTokens(direction), [direction])
  const usdtToUsd1Pair = useMemo(() => getSwapPairTokens('reverse'), [])
  const usd1ToUsdtPair = useMemo(() => getSwapPairTokens('forward'), [])
  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const amountIn = useMemo(
    () => parseTokenAmount(sellAmount, pair.sell.decimals),
    [pair.sell.decimals, sellAmount],
  )
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
        readErc20Balance(pair.sell.address, address!),
        readErc20Balance(pair.buy.address, address!),
        readErc20Allowance(pair.sell.address, address!, SWAP_CONFIG.router),
      ])
      return { sell, buy, approved }
    },
    enabled: walletReady,
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
      }),
    enabled: true,
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
      }),
    enabled: true,
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
      }),
    enabled: true,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
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
      }),
    enabled: authenticated && amountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(spotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, true)
  useVisibleQueryInterval(exchangeSpotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, true)
  useVisibleQueryInterval(exchangeSpotQuoteInvertedQuery, SWAP_CONFIG.quoteRefreshIntervalMs, true)
  useVisibleQueryInterval(
    amountQuoteQuery,
    SWAP_CONFIG.quoteRefreshIntervalMs,
    authenticated && amountIn > 0n,
  )

  const sellBalance = balancesQuery.data?.sell ?? 0n
  const buyBalance = balancesQuery.data?.buy ?? 0n
  const isBalancesLoading = walletReady && balancesQuery.isLoading
  const quotedOut = amountQuoteQuery.data?.quotedOut ?? 0n
  const spotQuotedOut = spotQuoteQuery.data?.quotedOut ?? 0n
  const exchangeSpotQuotedOut = exchangeSpotQuoteQuery.data?.quotedOut ?? 0n
  const exchangeSpotQuotedOutInverted = exchangeSpotQuoteInvertedQuery.data?.quotedOut ?? 0n
  const isQuoting =
    authenticated && amountIn > 0n && amountQuoteQuery.isPending && quotedOut === 0n
  const isSpotQuoting =
    amountIn === 0n && spotQuoteQuery.isPending && spotQuotedOut === 0n
  const isExchangePriceQuoting =
    exchangeSpotQuoteQuery.isPending && exchangeSpotQuotedOut === 0n
  const isExchangePriceInvertedQuoting =
    exchangeSpotQuoteInvertedQuery.isPending && exchangeSpotQuotedOutInverted === 0n

  const setSellAmount = useCallback(
    (value: string) => {
      const fractionLimit = Math.min(pair.sell.decimals, 6)

      if (!authenticated) {
        setSellAmountRaw(sanitizeTokenAmountInput(value, fractionLimit))
        return
      }

      setSellAmountRaw(
        capTokenAmountInput(value, sellBalance, pair.sell.decimals, 6),
      )
    },
    [authenticated, pair.sell.decimals, sellBalance],
  )

  useEffect(() => {
    if (!authenticated || !sellAmount) {
      return
    }

    const capped = capTokenAmountInput(sellAmount, sellBalance, pair.sell.decimals, 6)
    if (capped !== sellAmount) {
      setSellAmountRaw(capped)
    }
  }, [authenticated, pair.sell.decimals, sellAmount, sellBalance])

  useEffect(() => {
    if (amountQuoteQuery.error) {
      setError(
        amountQuoteQuery.error instanceof Error
          ? amountQuoteQuery.error.message
          : 'Quote failed',
      )
      return
    }

    if (amountIn > 0n) {
      setError(null)
    }
  }, [amountIn, amountQuoteQuery.error])

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

  const exceedsBalance = walletReady && amountIn > sellBalance
  const canSubmit =
    walletReady &&
    amountIn > 0n &&
    !exceedsBalance &&
    quotedOut > 0n &&
    !amountQuoteQuery.isPending &&
    !isSubmitting

  const fillPercent = useCallback(
    (percent: number) => {
      if (!walletReady || sellBalance === 0n) return
      const value = (sellBalance * BigInt(percent)) / 100n
      setSellAmountRaw(formatTokenAmount(value, pair.sell.decimals, 6))
    },
    [walletReady, pair.sell.decimals, sellBalance],
  )

  const flipDirection = useCallback(() => {
    flipDirectionInStore()
    setSellAmountRaw('')
  }, [flipDirectionInStore])

  const submit = useCallback(async (): Promise<boolean> => {
    if (!account) {
      setError(GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED)
      return false
    }
    if (!canSubmit) return false

    setIsSubmitting(true)
    setError(null)

    try {
      await approveTokenIfNeeded({
        account,
        token: pair.sell.address,
        amountIn,
      })
      await balancesQuery.refetch()

      await executeTokenSwap({
        account,
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        slippageBps,
      })
      setSellAmountRaw('')
      afterSwap()
      await balancesQuery.refetch()
      return true
    } catch (submitError: unknown) {
      setError(submitError instanceof Error ? submitError.message : 'Transaction failed')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [
    account,
    afterSwap,
    amountIn,
    balancesQuery,
    canSubmit,
    pair.buy.address,
    pair.sell.address,
    slippageBps,
  ])

  return {
    sellAmount,
    sellAmountDisplay,
    setSellAmount,
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
    amountOutMin: quotedOut > 0n ? calcAmountOutMin(quotedOut, slippageBps) : 0n,
  }
}
