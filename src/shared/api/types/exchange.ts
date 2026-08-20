import type { PaginationParams } from '~/shared/api/types/common'

export type TurbineLogType = 'received' | 'silenced' | 'cooled_claimed'

export interface AgxContributionSummary {
  total_burned_agx: string
  total_contribution_earned: string
  total_contribution_consumed: string
  available_contribution: string
}

export interface AgxContributionBurnLogItem {
  block_time: number
  burned_agx: string
  contribution_earned: string
  tx_hash: string | null
}

export interface AgxContributionConsumeLogItem {
  block_time: number
  claim_amount: string
  contribution_consumed: string
  contract_address: string
  /** Dao 领取 41–45 / 做市 51；缺省则按 contract_address 匹配 */
  sign_type?: number | string | null
  tx_hash: string | null
}

export interface TurbineSummary {
  pending_unlock: string
  unclaimed_total: string
  claimed_total: string
}

export interface TurbineLogItem {
  id: number
  turbine_type: TurbineLogType
  amount: string
  usdt_amount: string | null
  tx_hash: string | null
  block_number: number
  block_time: number
  status: number
  created_at: string | null
}

export interface TurbineLogsParams extends PaginationParams {
  turbine_type?: TurbineLogType[]
}
