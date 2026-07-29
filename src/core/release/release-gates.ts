/**
 * Pure live-gate helpers for release queue / buffer claims.
 * Call sites must re-read claimable after any prior write.
 */

export type ReleaseClaimGateReason = 'zeroAmount' | 'lockedUnknown'

export function evaluateReleaseQueueClaimGate(args: {
  claimable: bigint
  unknownLocked: boolean
}): ReleaseClaimGateReason | null {
  if (args.unknownLocked) return 'lockedUnknown'
  if (args.claimable <= 0n) return 'zeroAmount'
  return null
}

export function evaluateReleaseBufferClaimGate(args: {
  claimable: bigint
  unknownLocked: boolean
}): ReleaseClaimGateReason | null {
  return evaluateReleaseQueueClaimGate(args)
}

export function releaseProgressBps(claimable: bigint, releasing: bigint): number {
  const total = claimable + releasing
  if (total <= 0n) return 0
  return Number((claimable * 10_000n) / total)
}
