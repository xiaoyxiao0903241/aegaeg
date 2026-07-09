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
  isQuotePending,
  isSubmitting,
}: {
  walletReady: boolean
  amountIn: bigint
  sellBalance: bigint
  quotedOut: bigint
  isQuotePending: boolean
  isSubmitting: boolean
}): boolean {
  const exceedsBalance = walletReady && amountIn > sellBalance
  return (
    walletReady &&
    amountIn > 0n &&
    !exceedsBalance &&
    quotedOut > 0n &&
    !isQuotePending &&
    !isSubmitting
  )
}
