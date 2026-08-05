/**
 * 奖励页签名领取与 Mixed 领取的写前阻断（纯函数）。
 *
 * 简单签名奖励（RewardManager 等）与 Mixed（Lucky / DaoPool）走不同的合约方法，
 * 阻断原因分开返回，页面据此给出对应提示。
 */

export type RewardsSimpleClaimBlockReason = 'notSessionReady' | 'zeroAmount' | 'lockedUnknown'

export type RewardsMixedBlockReason =
  | 'zeroAmount'
  | 'insufficientReward'
  | 'insufficientContribution'
  | 'releasePlanUnresolved'
  | 'restakePlanUnresolved'
  | 'luckyPaused'
  | 'notClaimable'

/**
 * 简单签名领取是否可发起
 *
 * 会话未就绪、解锁状态未知、金额为零时分别阻断；
 * 未知锁定单独拦一层，避免把「仍在确认」当成「余额不足」误导提示。
 *
 * @param sessionReady 会话是否就绪
 * @param amount 请求领取的数量
 * @param unknownLocked 合约解锁状态是否仍未知
 */
export function evaluateRewardsSimpleClaim(args: {
  sessionReady: boolean
  amount: bigint
  unknownLocked: boolean
}): RewardsSimpleClaimBlockReason | null {
  if (!args.sessionReady) return 'notSessionReady'
  if (args.unknownLocked) return 'lockedUnknown'
  if (args.amount <= 0n) return 'zeroAmount'
  return null
}

/**
 * Mixed 领取（Lucky / DaoPool）的写前阻断
 *
 * 先看抽奖侧（池暂停 / 未中奖 / 已领），再核对金额与计划索引；
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
 * 仅当池未暂停、中奖、未领取且金额为正时才走抽奖资金；
 * 其余情况需回退到签名领取或直接阻断。
 *
 * @param paused 池是否暂停
 * @param won 是否中奖
 * @param rewardClaimed 是否已领取
 * @param rewardAmount 奖励金额
 */
export function isLuckyClaimable(args: {
  paused: boolean
  won: boolean
  rewardClaimed: boolean
  rewardAmount: bigint
}): boolean {
  return !args.paused && args.won && !args.rewardClaimed && args.rewardAmount > 0n
}
