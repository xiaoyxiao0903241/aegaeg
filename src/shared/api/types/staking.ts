import type { Paginated, PaginationParams } from '~/shared/api/types/common'

export type BondFlowOperation = 'PURCHASE' | 'REDEEM' | 'REWARD' | 'RESTAKE'

/** 质押流水操作；EARLY_STAKE 为共建（EarlyStaking），索引也可能写 earlyStake。 */
export type StakeFlowOperation =
  'STAKE' | 'REWARD' | 'EXTRA_REWARD' | 'CLAIM_PRINCIPAL' | 'RESTAKE' | 'EARLY_STAKE'

export type X0MiningLogOperation = 'STAKE_X' | 'UNSTAKE_X' | 'REWARD'

export type X0MiningPositionOperation = 'STAKE_X' | 'UNSTAKE_X'

export interface StakeAddressCountStats {
  stake_address_count: number
}

/** POST /protocol-market-stats/series · `range` */
export type ProtocolMarketStatsRange = 'week' | 'month' | 'year' | 'all'

/** POST /protocol-market-stats/series · `metric`：market=总市值，stake=总质押 */
export type ProtocolMarketStatsMetric = 'market' | 'stake'

export interface ProtocolMarketStatsSeriesParams {
  range: ProtocolMarketStatsRange
  metric: ProtocolMarketStatsMetric
}

export interface ProtocolMarketStatsSeriesPoint {
  date: string
  amount: string
}

/** POST /protocol-market-stats/series 解包后的 `data` */
export interface ProtocolMarketStatsSeriesData {
  metric: ProtocolMarketStatsMetric
  range: ProtocolMarketStatsRange
  list: ProtocolMarketStatsSeriesPoint[]
  latest_growth_rate: number | null
}

/** POST /protocol-market-stats/aggregate-series · `metric` */
export type ProtocolMarketStatsAggregateMetric = 'stake' | 'lp_bond' | 'burn_bond' | 'x_stake'

export interface ProtocolMarketStatsAggregateParams {
  range: ProtocolMarketStatsRange
  metric: ProtocolMarketStatsAggregateMetric
}

/** POST /protocol-market-stats/aggregate-series 解包后的 `data` */
export interface ProtocolMarketStatsAggregateData {
  metric: ProtocolMarketStatsAggregateMetric
  range: ProtocolMarketStatsRange
  mode: string
  list: ProtocolMarketStatsSeriesPoint[]
  latest_growth_rate: number | null
}

export interface BondFlowLogItem {
  user_address: string
  operation: BondFlowOperation
  term_days: number
  payout: string
  block_time: number
  tx_hash: string | null
}

export interface BondFlowLogsParams extends PaginationParams {
  operation?: BondFlowOperation[]
}

/** POST /bond-flow/lp-reward-total · /bond-flow/burn-reward-total · 已领取收益（gAGX） */
export interface BondFlowRewardTotal {
  total_reward: string
}

export interface BondPurchaseItem {
  block_time: number
  term_days: number
  deposit_amount: string
  discount_bp: number | null
  payout: string
  tx_hash: string | null
}

export interface BondPurchasesPage extends Paginated<BondPurchaseItem> {
  total_purchase_amount: string
}

export interface StakeFlowLogItem {
  operation: StakeFlowOperation
  term_days: number
  amount: string
  block_time: number
  tx_hash: string | null
}

export interface StakeFlowLogsParams extends PaginationParams {
  operation?: StakeFlowOperation[]
}

export interface StakePositionItem {
  stake_category: string
  term_days: number
  amount: string
  block_time: number
  expire_at: number
  released_pct: string
  tx_hash: string | null
}

export interface StakePositionsPage extends Paginated<StakePositionItem> {
  total_stake_amount: string
}

export interface X0MiningLogItem {
  operation: 'STAKE_X' | 'REDEEM' | 'REWARD'
  amount: string
  tx_hash: string | null
  block_time: number
}

export interface X0MiningLogsParams extends PaginationParams {
  operation?: X0MiningLogOperation[]
}

export interface X0MiningPositionItem {
  block_time: number
  operation: X0MiningPositionOperation
  amount: string
  tx_hash: string | null
}

export interface X0MiningPositionsPage extends Paginated<X0MiningPositionItem> {
  total_stake_amount: string
}

/** POST /x0-mining/summary · 个人挖矿概览 */
export interface X0MiningSummary {
  /** 已释放（gAGX） */
  total_redeemed_amount: string
  /** 已领取的挖矿产出（X）；页面「挖矿总产出」原样展示 */
  claimed_x_reward: string
}
