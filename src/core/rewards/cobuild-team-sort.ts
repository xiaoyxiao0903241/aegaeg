/**
 * 共建奖「我的团队」列头排序：单活动列 ↔ 请求体 `sort_*`。
 *
 * 点同一列翻转方向；点另一列切到该列且默认 desc（对齐原型）。
 * 请求只带当前列对应键，不发旧 `sort_time`。
 *
 * @see docs/backend-api/api.md #rank-reward/team-members
 */

export type CobuildTeamSortDir = 'asc' | 'desc'
export type CobuildTeamSortColumn = 'bound_at' | 'making_market' | 'making_rank'

export type CobuildTeamSort = {
  column: CobuildTeamSortColumn
  dir: CobuildTeamSortDir
}

export type CobuildTeamSortParams = {
  sort_bound_at?: CobuildTeamSortDir
  sort_making_market?: CobuildTeamSortDir
  sort_making_rank?: CobuildTeamSortDir
}

/** 与 `teamColumns` 下标对齐：地址列不可排。 */
export const COBUILD_TEAM_COLUMN_SORT: readonly (CobuildTeamSortColumn | null)[] = [
  'bound_at',
  null,
  'making_market',
  'making_rank',
]

export const DEFAULT_COBUILD_TEAM_SORT: CobuildTeamSort = {
  column: 'bound_at',
  dir: 'desc',
}

const SORT_PARAM_KEY = {
  bound_at: 'sort_bound_at',
  making_market: 'sort_making_market',
  making_rank: 'sort_making_rank',
} as const

/**
 * 列头点击后的下一活动排序。
 *
 * @param current 当前活动列与方向
 * @param column 被点击的可排序列
 */
export function toggleCobuildTeamSort(
  current: CobuildTeamSort,
  column: CobuildTeamSortColumn,
): CobuildTeamSort {
  if (current.column === column) {
    return { column, dir: current.dir === 'desc' ? 'asc' : 'desc' }
  }
  return { column, dir: 'desc' }
}

/**
 * 组装 team-members 请求里的排序字段；只含当前列。
 *
 * @param sort 活动列与方向
 */
export function cobuildTeamSortToParams(sort: CobuildTeamSort): CobuildTeamSortParams {
  return { [SORT_PARAM_KEY[sort.column]]: sort.dir }
}
