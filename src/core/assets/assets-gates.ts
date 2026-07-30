/**
 * Pure live-gate helpers for assets Mixed / redeem / xmine claim
 * (preflight → live → write). Call sites must re-read after any approve.
 */

export type MixedClaimGateReason =
  | 'zeroAmount'
  | 'insufficientReward'
  | 'insufficientContribution'
  | 'releasePlanUnresolved'
  | 'restakePlanUnresolved'

export type RedeemGateReason = 'nothingToRedeem'

export type XmineClaimGateReason = 'zeroAmount' | 'warmupActive'

export type XmineActivateWarmupGateReason = 'noWarmup' | 'warmupNotEnded'

export function evaluateMixedClaimGate(args: {
  amount: bigint
  rewardAvailable: bigint
  contribution: bigint
  requiredContribution: bigint
  releasePlanIndex: number | null
  restakePlanIndex: number | null
}): MixedClaimGateReason | null {
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.rewardAvailable < args.amount) return 'insufficientReward'
  if (args.releasePlanIndex == null) return 'releasePlanUnresolved'
  if (args.restakePlanIndex == null) return 'restakePlanUnresolved'
  if (args.contribution < args.requiredContribution) return 'insufficientContribution'
  return null
}

export function evaluateRedeemGate(args: { amount: bigint }): RedeemGateReason | null {
  if (args.amount <= 0n) return 'nothingToRedeem'
  return null
}

export function evaluateXmineClaimGate(args: {
  pending: bigint
  warmupGons: bigint
}): XmineClaimGateReason | null {
  if (args.pending <= 0n) return 'zeroAmount'
  if (args.warmupGons > 0n) return 'warmupActive'
  return null
}

export function evaluateXmineUnstakeGate(args: {
  activeGons: bigint
  warmupGons: bigint
}): RedeemGateReason | XmineClaimGateReason | null {
  if (args.warmupGons > 0n) return 'warmupActive'
  if (args.activeGons <= 0n) return 'nothingToRedeem'
  return null
}

/** Handbook §15.4 — activate after warmup window; fail-closed before endTime. */
export function evaluateXmineActivateWarmupGate(args: {
  warmupGons: bigint
  warmupEndTime: bigint
  nowSec?: number
}): XmineActivateWarmupGateReason | null {
  if (args.warmupGons <= 0n) return 'noWarmup'
  const now = args.nowSec ?? Math.floor(Date.now() / 1000)
  if (now < Number(args.warmupEndTime)) return 'warmupNotEnded'
  return null
}
