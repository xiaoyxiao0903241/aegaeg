/**
 * Live quote amount for submit / display.
 * `keepPreviousData` placeholders must not drive UI or canSubmit.
 */
export function resolveLiveQuotedOut(
  isPlaceholderData: boolean,
  quotedOut: bigint | undefined | null,
): bigint {
  if (isPlaceholderData) return 0n
  return quotedOut ?? 0n
}

/** Trade / Flash submit gate after live quote resolution. */
export function canSubmitQuotedSwap({
  walletReady,
  amountIn,
  sellBalance,
  quotedOut,
  amountOutMin,
  isPlaceholderData,
  isQuotePending,
  isBalancesLoading,
  isSubmitting,
  blockResubmit = false,
  quoteUpdatedAt,
  maxQuoteAgeMs,
  nowMs = Date.now(),
}: {
  walletReady: boolean
  amountIn: bigint
  sellBalance: bigint
  /** Prefer `resolveLiveQuotedOut(...)` so placeholders are already zeroed. */
  quotedOut: bigint
  /** On-chain floor; must be > 0 whenever a live quote is present. */
  amountOutMin: bigint
  /** Fail-closed even if a caller forgets to zero placeholder quotedOut. */
  isPlaceholderData: boolean
  isQuotePending: boolean
  /** Balance query still loading — do not infer sellBalance===0 as "empty wallet". */
  isBalancesLoading: boolean
  isSubmitting: boolean
  /** Latched after `WalletTransactionWaitError` outcome `unknown` — blocks double-submit. */
  blockResubmit?: boolean
  /** `query.dataUpdatedAt` for the amount quote; required with `maxQuoteAgeMs`. */
  quoteUpdatedAt?: number
  maxQuoteAgeMs?: number
  nowMs?: number
}): boolean {
  const exceedsBalance = walletReady && amountIn > sellBalance
  const quoteTooOld =
    typeof maxQuoteAgeMs === 'number' &&
    maxQuoteAgeMs >= 0 &&
    (typeof quoteUpdatedAt !== 'number' ||
      quoteUpdatedAt <= 0 ||
      nowMs - quoteUpdatedAt > maxQuoteAgeMs)

  return (
    walletReady &&
    amountIn > 0n &&
    !exceedsBalance &&
    !isBalancesLoading &&
    !isPlaceholderData &&
    quotedOut > 0n &&
    amountOutMin > 0n &&
    !isQuotePending &&
    !quoteTooOld &&
    !isSubmitting &&
    !blockResubmit
  )
}
