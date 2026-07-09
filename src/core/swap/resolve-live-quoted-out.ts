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
  isPlaceholderData,
  isQuotePending,
  isSubmitting,
}: {
  walletReady: boolean
  amountIn: bigint
  sellBalance: bigint
  /** Prefer `resolveLiveQuotedOut(...)` so placeholders are already zeroed. */
  quotedOut: bigint
  /** Fail-closed even if a caller forgets to zero placeholder quotedOut. */
  isPlaceholderData: boolean
  isQuotePending: boolean
  isSubmitting: boolean
}): boolean {
  const exceedsBalance = walletReady && amountIn > sellBalance
  return (
    walletReady &&
    amountIn > 0n &&
    !exceedsBalance &&
    !isPlaceholderData &&
    quotedOut > 0n &&
    !isQuotePending &&
    !isSubmitting
  )
}
