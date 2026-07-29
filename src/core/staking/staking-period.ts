/** Stake open periods — liquid + three locked pools (Pre-Design §1). */
export type StakePeriod = 'liquid' | '180' | '360' | '540'

/** Bond open periods — no liquid (Pre-Design §1). */
export type BondPeriod = '180' | '360' | '540'

export type StakePoolContractKey =
  'liquidStaking' | 'lockedStaking180d' | 'lockedStaking360d' | 'lockedStaking540d'

export type LpBondDepositoryKey = 'bondDepository180d' | 'bondDepository360d' | 'bondDepository540d'

export type BurnBondDepositoryKey =
  'burnBondDepository180d' | 'burnBondDepository360d' | 'burnBondDepository540d'

/** Period → BSC_CONTRACTS field key for AGX stake open path. */
export function resolveStakePoolKey(period: StakePeriod): StakePoolContractKey {
  if (period === 'liquid') return 'liquidStaking'
  if (period === '180') return 'lockedStaking180d'
  if (period === '360') return 'lockedStaking360d'
  return 'lockedStaking540d'
}

/** Period → LP Bond depository key for BondHelper zap. */
export function resolveLpBondDepositoryKey(period: BondPeriod): LpBondDepositoryKey {
  if (period === '180') return 'bondDepository180d'
  if (period === '360') return 'bondDepository360d'
  return 'bondDepository540d'
}

/** Period → Burn Bond depository key for BondHelper zap. */
export function resolveBurnBondDepositoryKey(period: BondPeriod): BurnBondDepositoryKey {
  if (period === '180') return 'burnBondDepository180d'
  if (period === '360') return 'burnBondDepository360d'
  return 'burnBondDepository540d'
}
