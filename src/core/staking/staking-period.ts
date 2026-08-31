/**
 * 质押开放周期：活期 + 三个定期池。
 *
 * @see 手册 §8 质押 Staking
 */
export type StakePeriod = 'liquid' | '180' | '360' | '540'

/**
 * 债券开放周期：无活期，仅三个定期档。
 *
 * @see 手册 §10 债券 Bond / BurnBond
 */
export type BondPeriod = '180' | '360' | '540'

/** 债券产品：LP 债 / 燃烧债。 */
export type BondKind = 'lp' | 'burn'

/** 定期档列表（债券周期；locked 质押同值复用）。 */
export const BOND_PERIODS = ['180', '360', '540'] as const satisfies readonly BondPeriod[]

/** 质押开放周期列表（含活期）。 */
export const STAKE_PERIODS = ['liquid', ...BOND_PERIODS] as const satisfies readonly StakePeriod[]

export function isStakePeriod(value: string): value is StakePeriod {
  return (STAKE_PERIODS as readonly string[]).includes(value)
}

export function isBondPeriod(value: string): value is BondPeriod {
  return (BOND_PERIODS as readonly string[]).includes(value)
}

const SECONDS_PER_DAY = 86_400

/**
 * 合约 `periodTime`（秒）→ 锁仓整天数。
 *
 * EarlyStaking / LockedStaking 的 periodTime 按秒；展示用整天。
 * 非整除四舍五入。缺数、非正、无法安全转 number 为 null（不猜天数）。
 *
 * @param periodTime 链上 periodTime（秒）
 * @returns 整天数；无法换算为 null
 * @see 手册 §8.4 EarlyStaking
 */
export function lockDaysFromPeriodSec(periodTime: bigint | undefined): number | null {
  if (periodTime == null || periodTime <= 0n) return null
  const sec = Number(periodTime)
  if (!Number.isFinite(sec) || sec <= 0) return null
  const days = Math.round(sec / SECONDS_PER_DAY)
  return days > 0 ? days : null
}

export type StakePoolContractKey =
  'liquidStaking' | 'lockedStaking180d' | 'lockedStaking360d' | 'lockedStaking540d'

export type LpBondDepositoryKey = 'bondDepository180d' | 'bondDepository360d' | 'bondDepository540d'

export type BurnBondDepositoryKey =
  'burnBondDepository180d' | 'burnBondDepository360d' | 'burnBondDepository540d'

/**
 * 质押周期 → BSC_CONTRACTS 字段 key，用于 AGX 质押路径。
 *
 * @param period 质押周期；非活期档落入 540 天
 * @returns 合约地址映射 key
 */
export function stakePoolKey(period: StakePeriod): StakePoolContractKey {
  if (period === 'liquid') return 'liquidStaking'
  if (period === '180') return 'lockedStaking180d'
  if (period === '360') return 'lockedStaking360d'
  return 'lockedStaking540d'
}

/**
 * 周期 → LP 债券合约 key，供 BondHelper zap 使用。
 *
 * @param period 债券周期
 * @returns 合约地址映射 key
 */
export function lpBondDepositoryKey(period: BondPeriod): LpBondDepositoryKey {
  if (period === '180') return 'bondDepository180d'
  if (period === '360') return 'bondDepository360d'
  return 'bondDepository540d'
}

/**
 * 周期 → 燃烧债券合约 key，供 BondHelper zap 使用。
 *
 * @param period 债券周期
 * @returns 合约地址映射 key
 */
export function burnBondDepositoryKey(period: BondPeriod): BurnBondDepositoryKey {
  if (period === '180') return 'burnBondDepository180d'
  if (period === '360') return 'burnBondDepository360d'
  return 'burnBondDepository540d'
}
