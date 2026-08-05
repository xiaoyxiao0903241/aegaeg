/**
 * 资产页写前阻断（纯函数）：Mixed / 赎回 / X 挖矿 三类的领取与解绑判断。
 * 调用方在 approve 后必须重读链上快照再走这里，避免用过期的 read 放行写操作。
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

/**
 * Mixed 领取的写前阻断
 *
 * 金额为零、可领不足、计划索引未解析或贡献不足时阻断，
 * 避免发起链上必然失败的交易。
 *
 * @param amount 请求领取的数量
 * @param rewardAvailable 链上可领余额
 * @param contribution 当前贡献值
 * @param requiredContribution 所需贡献值
 * @param releasePlanIndex 已解析的释放计划索引
 * @param restakePlanIndex 已解析的复投计划索引
 * @see 手册 §9.1 Mixed 领奖概念
 */
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

/** 本金赎回前置：可赎金额必须为正，否则直接提示不可赎。 */
export function evaluateRedeem(args: { amount: bigint }): RedeemBlockReason | null {
  if (args.amount <= 0n) return 'nothingToRedeem'
  return null
}

/**
 * X 挖矿可领判断
 *
 * 无待领金额或仍在暖机期时阻断；暖机中的收益不能提前领取。
 *
 * @param pending 待领金额
 * @param warmupGons 暖机中的份额
 */
export function evaluateXmineClaim(args: {
  pending: bigint
  warmupGons: bigint
}): XmineClaimBlockReason | null {
  if (args.pending <= 0n) return 'zeroAmount'
  if (args.warmupGons > 0n) return 'warmupActive'
  return null
}

/**
 * X 挖矿解绑判断
 *
 * 暖机未完成先挡解绑（份额尚未到账），活跃份额为零时无可赎。
 *
 * @param activeGons 活跃份额
 * @param warmupGons 暖机中的份额
 */
export function evaluateXmineUnstake(args: {
  activeGons: bigint
  warmupGons: bigint
}): RedeemBlockReason | XmineClaimBlockReason | null {
  if (args.warmupGons > 0n) return 'warmupActive'
  if (args.activeGons <= 0n) return 'nothingToRedeem'
  return null
}

/**
 * 激活暖机份额
 *
 * 暖机期间（未到 endTime）禁激活，防止未解锁部分提前转活期；
 * 需要真实时钟，调用方可注入 `nowSec` 便于测试。
 *
 * @param warmupGons 暖机中的份额
 * @param warmupEndTime 暖机结束时间戳（秒）
 * @param nowSec 当前时间戳（秒），缺省取系统时间
 * @see 手册 §15.4 用户写方法
 */
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
