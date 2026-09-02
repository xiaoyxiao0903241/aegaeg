import { DAO_REWARD_SIGN_TYPE } from '~/shared/api/types'
import { BSC_CONTRACTS } from '~/shared/config/contracts'

/**
 * 消耗记录「用途」文案 key。未知 sign_type / 未登记合约返回 null（UI 显示 -）。
 */
export type ConsumeLogPurposeKey =
  | 'stakeYield'
  | 'lpBondYield'
  | 'burnBondYield'
  | 'lucky'
  | 'rank'
  | 'referral'
  | 'participation'
  | 'surpass'
  | 'lifetime'
  | 'market'

const MARKET_SIGN_TYPE = 51

const SIGN_TYPE_KEY: Readonly<Record<number, ConsumeLogPurposeKey>> = {
  [Number(DAO_REWARD_SIGN_TYPE.RANK_REWARD)]: 'rank',
  [Number(DAO_REWARD_SIGN_TYPE.REFERRAL_REWARD)]: 'referral',
  [Number(DAO_REWARD_SIGN_TYPE.PARTICIPATION_REWARD)]: 'participation',
  [Number(DAO_REWARD_SIGN_TYPE.SURPASS_REWARD)]: 'surpass',
  [Number(DAO_REWARD_SIGN_TYPE.LIFETIME_REWARD)]: 'lifetime',
  [MARKET_SIGN_TYPE]: 'market',
}

function parseSignType(raw: string | number | null | undefined): number | null {
  if (raw == null || raw === '') return null
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim())
  if (!Number.isInteger(n) || n <= 0) return null
  return n
}

function sameAddr(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.toLowerCase()
}

function matchesAny(addr: string, contracts: readonly string[]): boolean {
  return contracts.some((contract) => sameAddr(addr, contract))
}

const STAKE_CONTRACTS = [
  BSC_CONTRACTS.liquidStaking,
  BSC_CONTRACTS.lockedStaking180d,
  BSC_CONTRACTS.lockedStaking360d,
  BSC_CONTRACTS.lockedStaking540d,
  BSC_CONTRACTS.earlyStaking,
  BSC_CONTRACTS.stakingPool,
] as const

const LP_BOND_CONTRACTS = [
  BSC_CONTRACTS.bondDepository180d,
  BSC_CONTRACTS.bondDepository360d,
  BSC_CONTRACTS.bondDepository540d,
] as const

const BURN_BOND_CONTRACTS = [
  BSC_CONTRACTS.burnBondDepository180d,
  BSC_CONTRACTS.burnBondDepository360d,
  BSC_CONTRACTS.burnBondDepository540d,
] as const

function purposeFromAddress(addr: string): ConsumeLogPurposeKey | null {
  if (!addr.trim()) return null
  if (matchesAny(addr, STAKE_CONTRACTS)) return 'stakeYield'
  if (matchesAny(addr, LP_BOND_CONTRACTS)) return 'lpBondYield'
  if (matchesAny(addr, BURN_BOND_CONTRACTS)) return 'burnBondYield'
  if (sameAddr(addr, BSC_CONTRACTS.luckyPool)) return 'lucky'
  if (sameAddr(addr, BSC_CONTRACTS.marketFund)) return 'market'
  return null
}

/**
 * 消耗记录用途：先 sign_type（DaoPool 41–45 / 做市 51），再合约地址；对不上为 null。
 *
 * @param item.sign_type `/agx-contribution/consume-logs` 扩展字段
 * @param item.contract_address 发出贡献值事件的合约（原值）
 * @returns 用途 key；未知则 null
 * @see docs/backend-api/api.md #agx-contribution/consume-logs
 */
export function consumeLogPurposeKey(item: {
  sign_type?: string | number | null
  contract_address?: string | null
}): ConsumeLogPurposeKey | null {
  const signType = parseSignType(item.sign_type)
  if (signType != null) {
    const fromSign = SIGN_TYPE_KEY[signType]
    if (fromSign) return fromSign
  }
  return purposeFromAddress(item.contract_address ?? '')
}
