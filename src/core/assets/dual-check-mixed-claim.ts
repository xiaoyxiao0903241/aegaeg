import { evaluateMixedClaim, type MixedClaimBlockReason } from '~/core/assets/assets-block-reasons'

/** One independent chain read assembled by the caller — never reuse as both intent and live. */
export type MixedClaimSnapshot = {
  rewardAvailable: bigint
  contribution: bigint
  requiredContribution: bigint
  releasePlanIndex: number | null
  restakePlanIndex: number | null
}

export type MixedClaimReady = {
  amount: bigint
  releasePlanIndex: number
  restakePlanIndex: number
}

export type DualCheckMixedClaimResult =
  | { ok: true; ready: MixedClaimReady }
  | { ok: false; fail: { phase: 'intent' | 'live'; reason: MixedClaimBlockReason } }

/**
 * Dual live-block for assets Mixed: frozen intent amount vs two independent snapshots.
 * Pure — no wallet, WRITE_PATH, or invalidate.
 */
export function dualCheckMixedClaim(args: {
  amount: bigint
  intent: MixedClaimSnapshot
  live: MixedClaimSnapshot
}): DualCheckMixedClaimResult {
  const intentReason = evaluateMixedClaim({
    amount: args.amount,
    rewardAvailable: args.intent.rewardAvailable,
    contribution: args.intent.contribution,
    requiredContribution: args.intent.requiredContribution,
    releasePlanIndex: args.intent.releasePlanIndex,
    restakePlanIndex: args.intent.restakePlanIndex,
  })
  if (intentReason) {
    return { ok: false, fail: { phase: 'intent', reason: intentReason } }
  }

  const liveReason = evaluateMixedClaim({
    amount: args.amount,
    rewardAvailable: args.live.rewardAvailable,
    contribution: args.live.contribution,
    requiredContribution: args.live.requiredContribution,
    releasePlanIndex: args.live.releasePlanIndex,
    restakePlanIndex: args.live.restakePlanIndex,
  })
  if (liveReason) {
    return { ok: false, fail: { phase: 'live', reason: liveReason } }
  }

  const { releasePlanIndex, restakePlanIndex } = args.live
  if (releasePlanIndex == null || restakePlanIndex == null) {
    return {
      ok: false,
      fail: {
        phase: 'live',
        reason: releasePlanIndex == null ? 'releasePlanUnresolved' : 'restakePlanUnresolved',
      },
    }
  }

  return {
    ok: true,
    ready: {
      amount: args.amount,
      releasePlanIndex,
      restakePlanIndex,
    },
  }
}
