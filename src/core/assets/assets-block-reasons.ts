/**
 * Pure live-block helpers for assets Mixed / redeem / xmine claim
 * (preflight → live → write). Call sites must re-read after any approve.
 */

export type MixedClaimBlockReason =
  | 'zeroAmount'
  | 'insufficientReward'
  | 'insufficientContribution'
  | 'releasePlanUnresolved'
  | 'restakePlanUnresolved'

export type RedeemBlockReason = 'nothingToRedeem'

export type XmineClaimBlockReason = 'zeroAmount' | 'warmupActive'

export type XmineActivateWarmupBlockReason = 'noWarmup' | 'warmupNotEnded'

export function evaluateMixedClaim(args: {
  amount: bigint
  rewardAvailable: bigint
  contribution: bigint
  requiredContribution: bigint
  releasePlanIndex: number | null
  restakePlanIndex: number | null
}): MixedClaimBlockReason | null {
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.rewardAvailable < args.amount) return 'insufficientReward'
  if (args.releasePlanIndex == null) return 'releasePlanUnresolved'
  if (args.restakePlanIndex == null) return 'restakePlanUnresolved'
  if (args.contribution < args.requiredContribution) return 'insufficientContribution'
  return null
}

export function evaluateRedeem(args: { amount: bigint }): RedeemBlockReason | null {
  if (args.amount <= 0n) return 'nothingToRedeem'
  return null
}

export function evaluateXmineClaim(args: {
  pending: bigint
  warmupGons: bigint
}): XmineClaimBlockReason | null {
  if (args.pending <= 0n) return 'zeroAmount'
  if (args.warmupGons > 0n) return 'warmupActive'
  return null
}

export function evaluateXmineUnstake(args: {
  activeGons: bigint
  warmupGons: bigint
}): RedeemBlockReason | XmineClaimBlockReason | null {
  if (args.warmupGons > 0n) return 'warmupActive'
  if (args.activeGons <= 0n) return 'nothingToRedeem'
  return null
}

/** Handbook §15.4 — activate after warmup window; fail-closed before endTime. */
export function evaluateXmineActivateWarmup(args: {
  warmupGons: bigint
  warmupEndTime: bigint
  nowSec?: number
}): XmineActivateWarmupBlockReason | null {
  if (args.warmupGons <= 0n) return 'noWarmup'
  const now = args.nowSec ?? Math.floor(Date.now() / 1000)
  if (now < Number(args.warmupEndTime)) return 'warmupNotEnded'
  return null
}
