export interface Paginated<T> {
  total: number
  page: number
  page_size: number
  items: T[]
}

export interface PaginationParams {
  page?: number
  page_size?: number
}

/**
 * 共建级别：`making_rank` 为真实档；加赠只用于展示 `(+N)`。
 *
 * 仅 `is_boost_rank === true` 且 `boost_rank > 0` 时拼括号。
 */
export type MakingRankBoost = {
  making_rank: number
  boost_rank: number
  is_boost_rank: boolean
}
