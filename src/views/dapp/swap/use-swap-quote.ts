import { keepPreviousData, useQuery, type QueryKey } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { calcAmountOutMin } from '~/core/swap/calc-amount-out-min'
import {
  assertQuotedSwapStillSubmittable,
  canSubmitQuotedSwap,
  resolveLiveQuotedOut,
} from '~/core/swap/resolve-live-quoted-out'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/swap/token-amount'
import { SWAP_QUOTE_FAILED } from '~/web3/resolve-contract-error-message'
import { WalletTransactionWaitError } from '~/web3/wallet/wait-wallet-transaction'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearPendingUnknownLatch,
  isPendingUnknownLatched,
  latchPendingUnknown,
} from '~/web3/wallet/pending-unknown-latch'
import { needsTokenApproval } from '~/web3/swap/swap-write'
import { QUERY_STALE_TIME, queryClient } from '~/shared/api/query/query-client'
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
  /** When set, gates submit (not balance reads). Defaults to `walletReady`. */
  writeReady?: boolean
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
  writeReady = walletReady,
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

  function clearSubmitError() {
    setSubmitError(null)
  }

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

  const validationError = amountQuoteQuery.error ? SWAP_QUOTE_FAILED : null

  /** Bumps on each failed quote fetch so UI can re-toast the same sentinel. */
  const quoteErrorUpdatedAt = amountQuoteQuery.error ? amountQuoteQuery.errorUpdatedAt : 0

  const error = submitError ?? validationError

  const sellAmountDisplay = formatTokenAmountInputDisplay(sellAmount)

  const buyAmount =
    sessionReady && amountIn > 0n && quotedOut > 0n && !isAmountDebouncing
      ? formatTokenAmountInputDisplay(formatTokenAmount(quotedOut, buyDecimals, 6))
      : ''

  const amountOutMin = quotedOut > 0n ? calcAmountOutMin(quotedOut, slippageBps) : 0n

  const needsMaxApproval =
    walletReady && amountIn > 0n && needsTokenApproval(allowance, amountIn)

  const canSubmit =
    !isAmountDebouncing &&
    !isPendingUnknownLatched(WRITE_PATH.SWAP) &&
    canSubmitQuotedSwap({
      walletReady: writeReady,
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

  function setSellAmountAndUnlock(value: string) {
    clearPendingUnknownLatch(WRITE_PATH.SWAP)
    setBlockResubmit(false)
    setSellAmount(value)
  }

  function fillPercent(percent: number) {
    if (!walletReady) return
    clearPendingUnknownLatch(WRITE_PATH.SWAP)
    setBlockResubmit(false)
    fillSellPercent(percent)
  }

  async function runQuotedSubmit(
    execute: (helpers: {
      assertStillSubmittable: (live?: { sellBalance: bigint }) => Promise<bigint>
    }) => Promise<void>,
  ): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
    // canSubmit 已要求 !isAmountDebouncing ⇒ amountIn === debouncedAmountIn
    if (!canSubmit || amountIn !== debouncedAmountIn) {
      return { ok: false, error: null }
    }

    setIsSubmitting(true)
    setSubmitError(null)

    // Live re-gate: force-refresh quote after approve (may exceed maxQuoteAgeMs),
    // then read from query cache — not the render snapshot that started submit.
    // Callers must pass post-refetch sellBalance; render-closure balance is stale.
    const assertStillSubmittable = async (live?: {
      sellBalance: bigint
    }): Promise<bigint> => {
      if (live === undefined) {
        throw new Error('SWAP_SUBMIT_GATE_FAILED')
      }
      const queryKey = getQuoteQueryKey(debouncedAmountIn)
      await queryClient.fetchQuery({
        queryKey,
        queryFn: () => fetchQuote(debouncedAmountIn),
        staleTime: 0,
      })
      const queryState = queryClient.getQueryState<TQuote>(queryKey)
      const data = queryClient.getQueryData<TQuote>(queryKey)
      const liveQuotedOut = resolveLiveQuotedOut(false, selectQuotedOut(data))
      const liveAmountOutMin =
        liveQuotedOut > 0n ? calcAmountOutMin(liveQuotedOut, slippageBps) : 0n
      assertQuotedSwapStillSubmittable({
        walletReady: writeReady,
        amountIn: debouncedAmountIn,
        sellBalance: live.sellBalance,
        quotedOut: liveQuotedOut,
        amountOutMin: liveAmountOutMin,
        isPlaceholderData: false,
        isQuotePending: queryState?.status === 'pending',
        isBalancesLoading: false,
        isSubmitting: false,
        blockResubmit,
        quoteUpdatedAt: queryState?.dataUpdatedAt ?? 0,
        maxQuoteAgeMs: QUERY_STALE_TIME.quote,
      })
      return liveAmountOutMin
    }

    try {
      await execute({ assertStillSubmittable })
      clearPendingUnknownLatch(WRITE_PATH.SWAP)
      setBlockResubmit(false)
      clearAmount()
      return { ok: true }
    } catch (caught: unknown) {
      if (
        isUnknownSubmitOutcome(caught) ||
        (caught instanceof WalletTransactionWaitError && caught.outcome === 'unknown')
      ) {
        latchPendingUnknown(WRITE_PATH.SWAP)
        setBlockResubmit(true)
      }
      setSubmitError(caught)
      return { ok: false, error: caught }
    } finally {
      setIsSubmitting(false)
    }
  }

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
