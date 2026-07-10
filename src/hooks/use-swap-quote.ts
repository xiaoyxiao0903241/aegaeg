import { keepPreviousData, useQuery, type QueryKey } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { calcAmountOutMin } from '~/core/swap/calc-amount-out-min'
import {
  assertQuotedSwapStillSubmittable,
  canSubmitQuotedSwap,
  resolveLiveQuotedOut,
} from '~/core/swap/resolve-live-quoted-out'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/swap/token-amount'
import { SWAP_QUOTE_FAILED } from '~/views/dapp/web3/resolve-contract-error-message'
import { WalletTransactionWaitError } from '~/views/dapp/web3/wait-wallet-transaction'
import { needsTokenApproval } from '~/views/dapp/web3/swap-write'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { useVisibleInterval } from '~/hooks/queries/use-visible-interval'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'

const DEFAULT_QUOTE_DEBOUNCE_MS = 400

/** 值稳定 `delayMs` 后不再变化时返回。 */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs, value])

  return debounced
}

export type UseSwapQuoteOptions<TQuote> = {
  sessionReady: boolean
  quotesEnabled: boolean
  decimals: number
  buyDecimals: number
  sellBalance: bigint
  allowance: bigint
  balancesLoaded: boolean
  walletReady: boolean
  isBalancesLoading: boolean
  slippageBps: number
  debounceMs?: number
  quoteRefreshIntervalMs: number
  getQuoteQueryKey: (amountIn: bigint) => QueryKey
  fetchQuote: (amountIn: bigint) => Promise<TQuote>
  selectQuotedOut: (quote: TQuote | undefined) => bigint
  onBeforeCap?: () => void
}

export function useSwapQuote<TQuote>({
  sessionReady,
  quotesEnabled,
  decimals,
  buyDecimals,
  sellBalance,
  allowance,
  balancesLoaded,
  walletReady,
  isBalancesLoading,
  slippageBps,
  debounceMs = DEFAULT_QUOTE_DEBOUNCE_MS,
  quoteRefreshIntervalMs,
  getQuoteQueryKey,
  fetchQuote,
  selectQuotedOut,
  onBeforeCap,
}: UseSwapQuoteOptions<TQuote>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<unknown>(null)
  /** Blocks re-submit after a pending tx with unknown confirmation outcome. */
  const [blockResubmit, setBlockResubmit] = useState(false)

  const clearSubmitError = useCallback(() => {
    setSubmitError(null)
  }, [])

  const {
    amount: sellAmount,
    amountIn,
    setAmount: setSellAmount,
    clearAmount,
    fillPercent: fillSellPercent,
  } = useCappedTokenAmountInput({
    decimals,
    balance: sellBalance,
    balancesLoaded,
    sessionReady,
    onBeforeCap: onBeforeCap ?? clearSubmitError,
  })

  const debouncedAmountIn = useDebouncedValue(amountIn, debounceMs)
  const isAmountDebouncing = amountIn > 0n && amountIn !== debouncedAmountIn

  const amountQuoteQuery = useQuery({
    queryKey: getQuoteQueryKey(debouncedAmountIn),
    queryFn: () => fetchQuote(debouncedAmountIn),
    enabled: quotesEnabled && sessionReady && debouncedAmountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleInterval(
    amountQuoteQuery,
    quoteRefreshIntervalMs,
    quotesEnabled && sessionReady && debouncedAmountIn > 0n,
  )

  const quotedOut = resolveLiveQuotedOut(
    amountQuoteQuery.isPlaceholderData,
    selectQuotedOut(amountQuoteQuery.data),
  )

  const isQuoting =
    sessionReady &&
    amountIn > 0n &&
    (isAmountDebouncing ||
      amountQuoteQuery.isPending ||
      amountQuoteQuery.isPlaceholderData ||
      (amountQuoteQuery.isFetching && quotedOut === 0n))

  const validationError = useMemo(() => {
    if (!amountQuoteQuery.error) return null
    return SWAP_QUOTE_FAILED
  }, [amountQuoteQuery.error])

  /** Bumps on each failed quote fetch so UI can re-toast the same sentinel. */
  const quoteErrorUpdatedAt = amountQuoteQuery.error ? amountQuoteQuery.errorUpdatedAt : 0

  const error = submitError ?? validationError

  const sellAmountDisplay = useMemo(
    () => formatTokenAmountInputDisplay(sellAmount),
    [sellAmount],
  )

  const buyAmount = useMemo(
    () =>
      sessionReady && amountIn > 0n && quotedOut > 0n && !isAmountDebouncing
        ? formatTokenAmountInputDisplay(formatTokenAmount(quotedOut, buyDecimals, 6))
        : '',
    [sessionReady, amountIn, buyDecimals, isAmountDebouncing, quotedOut],
  )

  const amountOutMin = useMemo(
    () => (quotedOut > 0n ? calcAmountOutMin(quotedOut, slippageBps) : 0n),
    [quotedOut, slippageBps],
  )

  const needsMaxApproval =
    walletReady && amountIn > 0n && needsTokenApproval(allowance, amountIn)

  const canSubmit =
    !isAmountDebouncing &&
    canSubmitQuotedSwap({
      walletReady,
      amountIn: debouncedAmountIn,
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

  const runQuotedSubmit = useCallback(
    async (
      execute: (helpers: { assertStillSubmittable: () => void }) => Promise<void>,
    ): Promise<{ ok: true } | { ok: false; error: unknown | null }> => {
      // canSubmit 已要求 !isAmountDebouncing ⇒ amountIn === debouncedAmountIn
      if (!canSubmit || amountIn !== debouncedAmountIn) {
        return { ok: false, error: null }
      }

      setIsSubmitting(true)
      setSubmitError(null)

      const assertStillSubmittable = () => {
        const liveQuotedOut = resolveLiveQuotedOut(
          amountQuoteQuery.isPlaceholderData,
          selectQuotedOut(amountQuoteQuery.data),
        )
        const liveAmountOutMin =
          liveQuotedOut > 0n ? calcAmountOutMin(liveQuotedOut, slippageBps) : 0n
        // Mid-submit re-gate: ignore in-flight latch (already submitting). Check quote age /
        // balance / placeholder only — passing isSubmitting:true would always fail the gate.
        assertQuotedSwapStillSubmittable({
          walletReady,
          amountIn: debouncedAmountIn,
          sellBalance,
          quotedOut: liveQuotedOut,
          amountOutMin: liveAmountOutMin,
          isPlaceholderData: amountQuoteQuery.isPlaceholderData,
          isQuotePending: amountQuoteQuery.isPending,
          isBalancesLoading,
          isSubmitting: false,
          blockResubmit,
          quoteUpdatedAt: amountQuoteQuery.dataUpdatedAt,
          maxQuoteAgeMs: QUERY_STALE_TIME.quote,
        })
      }

      try {
        await execute({ assertStillSubmittable })
        setBlockResubmit(false)
        clearAmount()
        return { ok: true }
      } catch (caught: unknown) {
        if (caught instanceof WalletTransactionWaitError && caught.outcome === 'unknown') {
          setBlockResubmit(true)
        }
        setSubmitError(caught)
        return { ok: false, error: caught }
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      amountIn,
      amountQuoteQuery.data,
      amountQuoteQuery.dataUpdatedAt,
      amountQuoteQuery.isPending,
      amountQuoteQuery.isPlaceholderData,
      blockResubmit,
      canSubmit,
      clearAmount,
      debouncedAmountIn,
      isBalancesLoading,
      selectQuotedOut,
      sellBalance,
      slippageBps,
      walletReady,
    ],
  )

  return {
    sellAmount,
    sellAmountDisplay,
    amountIn,
    debouncedAmountIn,
    isAmountDebouncing,
    setSellAmount: setSellAmountAndUnlock,
    clearAmount,
    fillPercent,
    buyAmount,
    quotedOut,
    amountOutMin,
    isQuoting,
    canSubmit,
    needsMaxApproval,
    isSubmitting,
    submitError,
    setSubmitError,
    clearSubmitError,
    blockResubmit,
    setBlockResubmit,
    validationError,
    quoteErrorUpdatedAt,
    error,
    amountQuoteQuery,
    runQuotedSubmit,
  }
}
