import { evaluateMixedClaim, type MixedClaimBlockReason } from '~/core/assets/assets-block-reasons'

/** 一次独立的链上快照，由调用方组装；不可同时充当 intent 与 live。 */
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
 * Mixed 领取双重校验：对同一提交，用两次独立链上快照分别校验。
 *
 * intent 与 live 必须是两次独立读取，禁止复用同一份数据；若两次均通过，
 * 则以 live 的计划索引作为提交参数。纯函数，不触达钱包、不写链、不清缓存。
 *
 * @param args.amount 拟领取金额
 * @param args.intent 写前第一份快照
 * @param args.live 写前第二份快照（作为最终提交依据）
 * @returns 通过时返回 ok 与提交参数；否则返回失败阶段与阻断原因
 * @see 手册 §9.3 Mixed 领奖前端流程
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

  // evaluateMixedClaim 已拒绝 null 计划索引；此处仅收窄到 MixedClaimReady。
  const releasePlanIndex = args.live.releasePlanIndex!
  const restakePlanIndex = args.live.restakePlanIndex!

  return {
    ok: true,
    ready: {
      amount: args.amount,
      releasePlanIndex,
      restakePlanIndex,
    },
  }
}
