import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatSwapRate, formatSwapRateColon } from '~/lib/swap/format-swap-rate'
import {
  capTokenAmountInput,
  formatTokenAmount,
  formatTokenAmountInputDisplay,
  parseTokenAmount,
  sanitizeTokenAmountInput,
} from '~/lib/swap/token-amount'
import { getSwapPairTokens } from '~/lib/swap/swap-pair'
import { SWAP_CONFIG } from '~/config/swap'
import { QUERY_STALE_TIME } from '~/lib/query/query-client'
import { queryKeys } from '~/lib/query/query-keys'
import { useDappActions } from '~/stores/dapp-actions'
import { GENESIS_PURCHASE_ERROR } from '~/lib/web3/resolve-contract-error-message'
import { hasWalletAccount } from '~/lib/web3/wallet-connection-state'
import { useVisibleQueryInterval } from '~/hooks/queries/use-visible-query-interval'
import {
  readFlashSwapBalances,
  readFlashSwapQuote,
} from '~/web3/flash-swap-read'
import { approveUsdtForFlashSwapIfNeeded, executeFlashSwap } from '~/web3/flash-swap-write'

/** One-way USDT → USD1 via AegisUsd1Swap; no slippage UI (minOut = quote). */
export function useFlashSwapWidget(authenticated: boolean) {
  const account = useActiveAccount()
  const afterSwap = useDappActions((state) => state.afterSwap)
  const pair = useMemo(() => getSwapPairTokens('reverse'), [])
  const [sellAmount, setSellAmountRaw] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const amountIn = useMemo(
    () => parseTokenAmount(sellAmount, pair.sell.decimals),
    [pair.sell.decimals, sellAmount],
  )
  const spotQuoteAmount = useMemo(
    () => 10n ** BigInt(pair.sell.decimals),
    [pair.sell.decimals],
  )

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapBalances(address ?? ''),
    queryFn: () => readFlashSwapBalances(address!),
    enabled: walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  const spotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapQuote(spotQuoteAmount.toString()),
    queryFn: () => readFlashSwapQuote(spotQuoteAmount),
    enabled: true,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  const amountQuoteQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapQuote(amountIn.toString()),
    queryFn: () => readFlashSwapQuote(amountIn),
    enabled: authenticated && amountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(spotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, true)
  useVisibleQueryInterval(
    amountQuoteQuery,
    SWAP_CONFIG.quoteRefreshIntervalMs,
    authenticated && amountIn > 0n,
  )

  const sellBalance = balancesQuery.data?.usdt ?? 0n
  const buyBalance = balancesQuery.data?.usd1 ?? 0n
  const isBalancesLoading = walletReady && balancesQuery.isLoading
  const quotedOut = amountQuoteQuery.data ?? 0n
  const spotQuotedOut = spotQuoteQuery.data ?? 0n
  const isQuoting =
    authenticated && amountIn > 0n && amountQuoteQuery.isPending && quotedOut === 0n
  const isExchangePriceQuoting = spotQuoteQuery.isPending && spotQuotedOut === 0n

  const setSellAmount = useCallback(
    (value: string) => {
      const fractionLimit = Math.min(pair.sell.decimals, 6)

      if (!authenticated) {
        setSellAmountRaw(sanitizeTokenAmountInput(value, fractionLimit))
        return
      }

      setSellAmountRaw(capTokenAmountInput(value, sellBalance, pair.sell.decimals, 6))
    },
    [authenticated, pair.sell.decimals, sellBalance],
  )

  useEffect(() => {
    if (!authenticated || !sellAmount) return
    const capped = capTokenAmountInput(sellAmount, sellBalance, pair.sell.decimals, 6)
    if (capped !== sellAmount) setSellAmountRaw(capped)
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
    if (amountIn > 0n) setError(null)
  }, [amountIn, amountQuoteQuery.error])

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
    if (spotQuotedOut === 0n) {
      return isExchangePriceQuoting ? '' : '—'
    }

    return formatSwapRate({
      amountIn: spotQuoteAmount,
      amountOut: spotQuotedOut,
      decimalsIn: pair.sell.decimals,
      decimalsOut: pair.buy.decimals,
      symbolIn: pair.sell.symbol,
      symbolOut: pair.buy.symbol,
      fractionDigits: 4,
    })
  }, [
    isExchangePriceQuoting,
    pair.buy.decimals,
    pair.buy.symbol,
    pair.sell.decimals,
    pair.sell.symbol,
    spotQuoteAmount,
    spotQuotedOut,
  ])

  const overviewRateLabel = useMemo(() => {
    if (spotQuotedOut === 0n) {
      return isExchangePriceQuoting ? '' : '—'
    }

    return formatSwapRateColon({
      amountIn: spotQuoteAmount,
      amountOut: spotQuotedOut,
      decimalsIn: pair.sell.decimals,
      decimalsOut: pair.buy.decimals,
    })
  }, [
    isExchangePriceQuoting,
    pair.buy.decimals,
    pair.sell.decimals,
    spotQuoteAmount,
    spotQuotedOut,
  ])

  const routeLabel = `${pair.sell.symbol} → ${pair.buy.symbol}`

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

  const submit = useCallback(async (): Promise<boolean> => {
    if (!account) {
      setError(GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED)
      return false
    }
    if (!canSubmit) return false

    setIsSubmitting(true)
    setError(null)

    try {
      await approveUsdtForFlashSwapIfNeeded({ account, amountIn })
      await balancesQuery.refetch()

      await executeFlashSwap({
        account,
        usdtAmount: amountIn,
        minUsd1Out: quotedOut,
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
  }, [account, afterSwap, amountIn, balancesQuery, canSubmit, quotedOut])

  return {
    sellAmount,
    sellAmountDisplay,
    setSellAmount,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
    buyAmount,
    exchangePriceLabel,
    routeLabel,
    overviewRateLabel,
    walletReady,
    canSubmit,
    isQuoting,
    isExchangePriceQuoting,
    isBalancesLoading,
    isSubmitting,
    error,
    fillPercent,
    submit,
  }
}
