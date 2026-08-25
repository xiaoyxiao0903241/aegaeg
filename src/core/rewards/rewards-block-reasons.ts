/**
 * 奖励页 Mixed 领取的写前阻断（纯函数）。
 *
 * Mixed（Lucky / DaoPool）走合约方法；阻断原因分开返回，页面据此给出对应提示。
 */

export type RewardsMixedBlockReason =
  | 'zeroAmount'
  | 'insufficientReward'
  | 'insufficientContribution'
  | 'releasePlanUnresolved'
  | 'restakePlanUnresolved'
  | 'luckyPaused'
  | 'notClaimable'

/**
 * Mixed 领取（Lucky / DaoPool）的写前阻断
 *
 * 先看抽奖侧（池暂停 / 无可领 pending），再核对金额与计划索引；
 * 计划索引未解析或贡献不足也会阻断，避免发起链上必然失败的交易。
 *
 * @param amount 请求领取的数量
 * @param rewardAvailable 链上可领余额
 * @param contribution 当前贡献值
 * @param requiredContribution 所需贡献值
 * @param releasePlanIndex 已解析的释放计划索引
 * @param restakePlanIndex 已解析的复投计划索引
 * @param luckyPaused 抽奖池是否暂停
 * @param luckyClaimable 抽奖是否可领
 * @see 手册 §9 贡献值与 Mixed 领奖
 */
export function evaluateRewardsMixedClaim(args: {
  amount: bigint
  rewardAvailable: bigint
  contribution: bigint
  requiredContribution: bigint
  releasePlanIndex: number | null
  restakePlanIndex: number | null
  luckyPaused?: boolean
  luckyClaimable?: boolean
}): RewardsMixedBlockReason | null {
  if (args.luckyPaused) return 'luckyPaused'
  if (args.luckyClaimable === false) return 'notClaimable'
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.rewardAvailable < args.amount) return 'insufficientReward'
  if (args.releasePlanIndex == null) return 'releasePlanUnresolved'
  if (args.restakePlanIndex == null) return 'restakePlanUnresolved'
  if (args.contribution < args.requiredContribution) return 'insufficientContribution'
  return null
}

/**
 * 抽奖资金路径是否可领
 *
 * 累计账本待领大于 0 且池未暂停才可领；一次无轮次入口清全部 pending。
 *
 * @param paused 池是否暂停
 * @param rewardAmount 待领取毛奖励
 */
export function isLuckyClaimable(args: { paused: boolean; rewardAmount: bigint }): boolean {
  return !args.paused && args.rewardAmount > 0n
}
