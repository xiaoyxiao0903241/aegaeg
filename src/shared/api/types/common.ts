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
 * 共建级别：`making_rank` 为真实档；`boost_rank` 为托底档。
 *
 * 加赠中（`is_boost_rank` 且托底档 > 0）展示 `A{boost_rank}(+1)`；否则展示真实档。
 */
export type MakingRankBoost = {
  making_rank: number
  boost_rank: number
  is_boost_rank: boolean
}
