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

export interface QualifiedPartitionsResponse {
  count: number
}

export interface TeamReferralItem {
  address: string
  register_time: string | null
  /** Personal co-build / subscription amount (USD). */
  presale_volume?: string
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
  /** 今日增加直推业绩 */
  today_addition_direct_presale_volume?: string
  /** 今日增加团队业绩 */
  today_addition_sales_team_market?: string
}

export interface TeamRewardClaimLogItem {
  /** 0=待领取, 1=已领取, 2=已领取, 3=领取失败 */
  status: number
  amount: string
  /** 产生该奖励时用户的创世等级（用于列表展示） */
  presale_rank: number
  claimed_at: string | null
  created_at: string | null
}

export interface CommunityFundTotals {
  total: string
  claimed: string
  unlocked_claimable: string
  is_presale_fund_node: boolean
}

export interface CommunityFundLogItem {
  block_time: number
  /** 0=pending, 1=claimed, 2=completed, 3=failed */
  status: number
  presale_rank: number
  amount: string
}

export interface TeamRewardSignature {
  signature: string
  /**
   * On-chain claimReward(signType, amount, expireTime, salt, signature) needs
   * all of these; the backend signs over them, so they must be returned here.
   * Field names are matched flexibly in normalizeTeamRewardClaimPayload.
   */
  salt?: string
  amount?: string
  amountWei?: string
  signType?: string | number
  expireTime?: string | number
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
