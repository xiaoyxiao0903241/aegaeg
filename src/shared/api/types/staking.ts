import type { Paginated, PaginationParams } from '~/shared/api/types/common'

export type BondFlowOperation = 'PURCHASE' | 'REDEEM' | 'REWARD' | 'RESTAKE'

export type StakeFlowOperation = 'STAKE' | 'REWARD' | 'EXTRA_REWARD' | 'CLAIM_PRINCIPAL' | 'RESTAKE'

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
