/**
 * 质押 / 债券 zap / X 挖矿的写前实时门闸辅助函数（approve → 实时检查 → 写交易）。
 * 调用方在 approve 后必须重新读取链上状态，不能依赖渲染时的旧快照。
 */

export type StakeLiveBlockReason =
  | 'accountMigrated'
  | 'notBound'
  | 'insufficientBalance'
  | 'insufficientAllowance'
  | 'insufficientQuota'
  | 'poolPaused'
  | 'zeroAmount'
  | 'unavailable'

export type BondZapLiveBlockReason =
  | 'accountMigrated'
  | 'notBound'
  | 'insufficientBalance'
  | 'insufficientAllowance'
  | 'depositoryNotAuth'
  | 'insufficientDebtCapacity'
  | 'bondTooSmall'
  | 'bondTooLarge'
  | 'zeroAmount'
  | 'unavailable'

/** 手册 ErrorBondTooSmall：毛发放量 < 0.01 AGX（9 decimals）。 */
export const BOND_MIN_PAYOUT_AGX = 10_000_000n

export type XmineLiveBlockReason =
  'insufficientBalance' | 'insufficientAllowance' | 'insufficientQuota' | 'zeroAmount'

/**
 * 质押入金前的实时门闸检查。
 *
 * 迁移旧地址不得再写、推荐必须已绑定、池未暂停、余额 / 授权 / 额度
 * 足够覆盖拟质押量，任一项不满足即阻断；迁移状态未知按阻断处理，
 * 避免合约拒绝或写错账户。
 * 先检查剩余额度，再检查授权不足，避免用户先补授权后才发现额度不够。
 *
 * @param args.amount 拟质押数量
 * @param args.isBound 推荐是否已绑定
 * @param args.balance 钱包 AGX 余额
 * @param args.allowance 对质押合约的授权
 * @param args.remainingQuota 剩余额度
 * @param args.poolOpen 仅定期池使用；活期恒视为开放
 * @param args.isOldAccount 迁移状态：true 阻断；false 正常；null 未知按阻断处理；undefined 本次不检查
 * @returns 首个阻断原因
 * @see 手册 §8 质押 Staking
 */
export function evaluateStakeLive(args: {
  amount: bigint
  isBound: boolean
  balance: bigint
  allowance: bigint
  remainingQuota: bigint
  /** 仅定期池使用；活期恒视为开放。 */
  poolOpen?: boolean
  /** 手册 §17：已迁移旧地址不得继续写。 */
  isOldAccount?: boolean | null
}): StakeLiveBlockReason | null {
  if (args.isOldAccount === null) return 'unavailable'
  if (args.isOldAccount === true) return 'accountMigrated'
  if (args.amount <= 0n) return 'zeroAmount'
  if (!args.isBound) return 'notBound'
  if (args.poolOpen === false) return 'poolPaused'
  if (args.balance < args.amount) return 'insufficientBalance'
  if (args.remainingQuota < args.amount) return 'insufficientQuota'
  if (args.allowance < args.amount) return 'insufficientAllowance'
  return null
}

/**
 * 债券 zap 入金前的实时门闸检查。
 *
 * 迁移旧地址不得再写、推荐必须已绑定、depository 已授权，且余额与
 * 授权足够覆盖拟认购额，任一项不满足即阻断，避免链上交易必然失败。
 *
 * 大小限制跟链上用毛发放量；债务容量跟链上用净发放量。
 * 先检查兑付过小/过大与债务容量，再检查授权不足：
 * 否则用户可能先点「去授权」，授权后才发现这笔买不了。
 * 兑付或债务相关字段缺失（null / undefined）时返回 `unavailable`。
 *
 * @param args.amount 拟认购的 USD1 数量
 * @param args.isBound 推荐是否已绑定
 * @param args.balance 钱包 USD1 余额
 * @param args.allowance 对 BondHelper 的授权
 * @param args.depositoryAuthorized 目标债券是否已授权（authContracts）
 * @param args.isOldAccount 迁移旧地址；null = 未知按阻断处理；true = 已迁移阻断
 * @param args.maxDebt 债券债务上限；0 = 不限；null = 未知按阻断处理
 * @param args.totalDeposit 当前已占用债务
 * @param args.netPayout 扣 fee 后净发放量（记债 / 入库）
 * @param args.grossPayout 折扣后毛发放量（fee 前）
 * @param args.maxPayout maxPayout() 单笔绝对上限
 * @returns 首个阻断原因
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export function evaluateBondZapLive(args: {
  amount: bigint
  isBound: boolean
  balance: bigint
  allowance: bigint
  depositoryAuthorized: boolean
  isOldAccount?: boolean | null
  maxDebt?: bigint | null
  totalDeposit?: bigint | null
  netPayout?: bigint | null
  grossPayout?: bigint | null
  maxPayout?: bigint | null
}): BondZapLiveBlockReason | null {
  if (args.isOldAccount === null) return 'unavailable'
  if (args.isOldAccount === true) return 'accountMigrated'
  if (args.amount <= 0n) return 'zeroAmount'
  if (!args.isBound) return 'notBound'
  if (!args.depositoryAuthorized) return 'depositoryNotAuth'
  if (args.balance < args.amount) return 'insufficientBalance'
  if (
    args.maxDebt == null ||
    args.totalDeposit == null ||
    args.netPayout == null ||
    args.grossPayout == null ||
    args.maxPayout == null
  ) {
    return 'unavailable'
  }
  if (args.grossPayout < BOND_MIN_PAYOUT_AGX) {
    return 'bondTooSmall'
  }
  if (args.grossPayout > args.maxPayout) {
    return 'bondTooLarge'
  }
  if (args.maxDebt > 0n && args.totalDeposit + args.netPayout > args.maxDebt) {
    return 'insufficientDebtCapacity'
  }
  if (args.allowance < args.amount) return 'insufficientAllowance'
  return null
}

/**
 * X 挖矿质押前的实时门闸检查。
 *
 * 拟质押量须为正，余额与授权足够覆盖，且未超过挖矿额度。
 * 先检查挖矿额度，再检查授权不足，避免用户先补授权后才发现额度不够。
 *
 * @param args.amount 拟质押的 gAGX 数量
 * @param args.balance 钱包 gAGX 余额
 * @param args.allowance 对 XStakingPool 的授权
 * @param args.miningQuota 挖矿额度剩余
 * @returns 首个阻断原因
 * @see 手册 §15 XStakingPool X 挖矿
 */
export function evaluateXmineLive(args: {
  amount: bigint
  balance: bigint
  allowance: bigint
  miningQuota: bigint
}): XmineLiveBlockReason | null {
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.balance < args.amount) return 'insufficientBalance'
  if (args.miningQuota < args.amount) return 'insufficientQuota'
  if (args.allowance < args.amount) return 'insufficientAllowance'
  return null
}

/**
 * X 挖矿可投入上限。
 *
 * 手册 §15：current + amount ≤ miningQuotaOf。
 * 输入封顶 = min(gAGX 余额, max(0, quota − 已质押))。
 *
 * @param balance 钱包 gAGX 余额
 * @param miningQuota 挖矿额度
 * @param miningStaked 已质押并计入额度的数量
 * @returns 可投入的 gAGX 上限
 * @see 手册 §15 XStakingPool X 挖矿
 */
export function xmineSpendableCap(
  balance: bigint,
  miningQuota: bigint,
  miningStaked: bigint,
): bigint {
  const remaining = miningQuota > miningStaked ? miningQuota - miningStaked : 0n
  return balance < remaining ? balance : remaining
}

/**
 * 活期 warmup 激活前的实时门闸。
 *
 * 手册 §8.2：warmup 未到期时不允许 claim() 激活。
 *
 * @param isWarmupExpired 当前 warmup 是否已到期
 * @returns 未到期返回 'unavailable'；已到期返回 null
 * @see 手册 §8.2 活期 LiquidStaking
 */
export function evaluateLiquidWarmupClaimLive(
  isWarmupExpired: boolean,
): Extract<StakeLiveBlockReason, 'unavailable'> | null {
  if (!isWarmupExpired) return 'unavailable'
  return null
}
