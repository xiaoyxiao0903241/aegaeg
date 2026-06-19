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

export interface LoginRequest {
  address: string
  message: string
  signature: string
}

export interface LoginResponse {
  token: string
}

export interface SalesLogItem {
  id: number
  /** 期数 (phaseIndex + 1) */
  node_type: number
  amount: string
  /** 预售阶段索引 */
  phase_id: number
  /** 购买的 AGX 数量 */
  tokens: string
  tx_hash: string | null
  block_number: number
  block_time: number
  log_index: number
  /** 0=pending, 1=processing, 2=completed, 3=failed */
  status: number
  created_at: string | null
}

export interface RewardLogItem {
  id: number
  from_address: string
  to_address: string
  amount: string
  /** floor(amount / 0.03) */
  order_amount: string
  tx_hash: string | null
  block_number: number
  block_time: number
  log_index: number
  /** referral_paid | referral_withdrawn */
  reward_type: string
  status: number
  created_at: string | null
  updated_at: string | null
}

export interface RewardTotalItem {
  /** MARKET=做市团队极差奖, PRESALE=预售团队极差奖 */
  source_type: string
  total: string
  claimed: string
}

export interface RewardTotals {
  total: string
  claimed: string
  /** 按 source_type 分组明细（团队奖汇总接口返回） */
  items?: RewardTotalItem[]
}

export interface UserPerformance {
  address: string
  sales_team_market: string
  market_team_reward: string
  presale_team_reward: string
  team_reward_claimed: string
  sum_invest_usdt: string
  presale_volume: string
  presale_rank: number
  presale_referral_reward: string
  direct_presale_volume: string
}

export interface TeamReferralItem {
  address: string
  register_time: string | null
  presale_rank: number
  direct_referral_count: number
  sales_team_market: string
}

export interface TeamCommunityOverview {
  /** users 直推人数 */
  direct_referral_count: number
  /** referral_ancestors 所有下级数量 */
  descendant_count: number
  sales_team_market: string
  direct_presale_volume: string
  /** 今日新增直推人数 */
  today_addition_direct_count?: number
  /** 今日新增社区人数 */
  today_addition_team_count?: number
}

export interface TeamRewardClaimLogItem {
  /** 0=待领取, 1=已领取, 2=已过期, 3=已替换 */
  status: number
  amount: string
  claimed_at: string | null
  created_at: string | null
}

export interface TeamRewardSignature {
  signature: string
  /** 文档未声明；若后端扩展返回则用于链上 claim */
  salt?: string
  amount?: string
  amountWei?: string
}

export interface ClaimConfirmRequest {
  salt: string
  txHash: string
}

export interface ClaimConfirmOrder {
  id: number
  orderType: number
  salt: string
  amount: string
  amountWei: string
  status: number
  claimTxHash: string | null
  claimBlock: number | null
  claimedAt: string | null
}

export interface ClaimConfirmResult {
  confirmed: boolean
  alreadyConfirmed: boolean
  ignored: boolean
  reason?: string
  txHash: string
  order: ClaimConfirmOrder
  summary?: {
    team_reward: {
      distributed: string
      claimed: string
      pending: string
    }
    market_team_reward?: {
      distributed: string
    }
    presale_team_reward?: {
      distributed: string
    }
  }
}
