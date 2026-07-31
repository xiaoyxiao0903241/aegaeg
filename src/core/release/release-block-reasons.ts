/**
 * Pure live-block helpers for release queue / buffer claims.
 * Call sites must re-read claimable after any prior write.
 * Queue (RewardQueue) and buffer (PRV) share the same claimable/unknown rules.
 */

export type ReleaseClaimBlockReason = 'zeroAmount' | 'lockedUnknown'

/** `null` = may submit; otherwise fail-closed block reason. */
export function releaseClaimBlockReason(args: {
  claimable: bigint
  unknownLocked: boolean
}): ReleaseClaimBlockReason | null {
  if (args.unknownLocked) return 'lockedUnknown'
  if (args.claimable <= 0n) return 'zeroAmount'
  return null
}

export function releaseProgressBps(claimable: bigint, releasing: bigint): number {
  const total = claimable + releasing
  if (total <= 0n) return 0
  return Number((claimable * 10_000n) / total)
}
