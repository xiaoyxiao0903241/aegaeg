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
  /** 状态码：0=待处理 1=处理中 2=已完成 3=失败 */
  status: number
  created_at: string | null
}

export interface RewardLogItem {
  id: number
  from_address: string
  to_address: string
  amount: string
  /** 公式 floor(amount / 0.03) 计算所得 */
  order_amount: string
  tx_hash: string | null
  block_number: number
  block_time: number
  log_index: number
  /** 取值：referral_paid 推荐已支付 / referral_withdrawn 推荐已提取 */
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

/** 与 OpenAPI UserPerformanceItem 对齐（`/performance`、`/search/performance`）。 */
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
  /** 后端返回的推荐人地址；仅当链上推荐人缺失时作展示回退。 */
  invite_address?: string | null
}

/** 与 OpenAPI QualifiedPartitionStats 对齐。 */
export interface QualifiedPartitionsResponse {
  my_presale_rank: number
  target_rank: number | null
  threshold: number
  count: number
  direct_qualified_count: number
  team_qualified_count: number
  early_return: boolean
}

/** 与 OpenAPI TeamReferralItem 对齐（`POST /team/referrals`）。 */
export interface TeamReferralItem {
  address: string
  register_time: string | null
  presale_rank: number
  direct_referral_count: number
  sales_team_market: string
  /** 团队业绩（AGX） */
  making_market: string
  /** 团队业绩（USD） */
  making_market_usd: string
  /** 做市等级 */
  making_rank: number
  /** 持仓（AGX） */
  active_stake_balance: string
  /** 持仓（USD） */
  active_stake_balance_usd: string
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

/**
 * POST /team/making-overview 解包后的 `data`。
 * 四个业绩字段已是 USD（无 `_usd` 后缀）。
 *
 * @see docs/backend-api/api.md #team/making-overview
 */
export interface TeamMakingOverview {
  direct_referral_count: number
  making_direct_team_market: string
  today_addition_making_direct_team_market: string
  team_count: number
  making_market: string
  today_addition_making_market: string
  making_rank: number
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
  /** 状态码：0=待领取 1=已领取 2=已完成 3=失败 */
  status: number
  presale_rank: number
  amount: string
}

export interface MakingOverview {
  total_reward: string
  making_rank: number
  personal_position: string
  making_market: string
  small_market: string
  available_contribution: string
}

/**
 * POST /user/user-node-type 解包后的 `data`。
 *
 * @see docs/backend-api/api.md #user/user-node-type
 */
export interface UserNodeType {
  /** 是否有发展津贴领取资格。 */
  is_user_node_type: boolean
}
