import type { DaoRewardTypeTotals } from '~/shared/api/types'
import { parseApiAmount } from '~/shared/presenters/format'

export type RewardsApiClaimView = 'referral' | 'participate' | 'cobuild' | 'grant'

/**
 * 读取待领汇总里的一个类型。缺字段不当成 0。
 *
 * @param totals 待领汇总；未加载为 null
 * @param field 接口字段
 * @returns 可领数量；未知为 null
 */
export function typeTotalAmount(
  totals: DaoRewardTypeTotals | null | undefined,
  field: keyof DaoRewardTypeTotals,
): number | null {
  if (totals == null) return null
  return parseApiAmount(totals[field])
}

/** 待领大于 0 才算可领；未加载 / 0 不当成可领。 */
export function hasTypeTotalClaimable(value: number | null | undefined): boolean {
  return value != null && value > 0
}

/**
 * Hub 四张后端卡的待领额：推荐 / 参与 / 共建 / 发展。
 *
 * 共建 = 共建奖 + 平超奖。幸运走链、创世维持原接口，不走这里。
 *
 * @param view 后端待领卡
 * @param totals 待领汇总
 * @returns 可领数量；未知为 null
 */
export function hubApiClaimableFromTypeTotals(
  view: RewardsApiClaimView,
  totals: DaoRewardTypeTotals | null | undefined,
): number | null {
  if (view === 'cobuild') {
    const rank = typeTotalAmount(totals, 'RANK_REWARD')
    const surpass = typeTotalAmount(totals, 'SURPASS_REWARD')
    if (rank == null && surpass == null) return null
    return (rank ?? 0) + (surpass ?? 0)
  }
  if (view === 'referral') return typeTotalAmount(totals, 'REFERRAL_REWARD')
  if (view === 'participate') return typeTotalAmount(totals, 'PARTICIPATION_REWARD')
  return typeTotalAmount(totals, 'MARKET_FUND')
}
