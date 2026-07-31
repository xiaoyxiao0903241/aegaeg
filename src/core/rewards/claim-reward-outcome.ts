export type ClaimRewardExecuteResult = {
  confirmError?: unknown
  confirmResult: unknown
  txHash: string
}

export type ClaimRewardOutcome = {
  status: 'success' | 'confirm_failed'
  /** Money-path invariant: false when confirm failed after on-chain success. */
  shouldInvalidate: boolean
  confirmResult: unknown
  txHash: string
}

/**
 * Map claim execute result → UI status + whether to run `invalidateAfterTeamClaim`.
 * `confirm_failed` must never invalidate (do not optimistic-clear balances).
 */
export function claimRewardOutcome(result: ClaimRewardExecuteResult): ClaimRewardOutcome {
  if (result.confirmError) {
    return {
      status: 'confirm_failed',
      shouldInvalidate: false,
      confirmResult: null,
      txHash: result.txHash,
    }
  }
  return {
    status: 'success',
    shouldInvalidate: true,
    confirmResult: result.confirmResult,
    txHash: result.txHash,
  }
}
