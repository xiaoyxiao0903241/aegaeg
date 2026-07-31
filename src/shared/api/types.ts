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

/** Matches OpenAPI UserPerformanceItem (`/performance`, `/search/performance`). */
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
  /** Inviter address from backend; preferred over on-chain referrer when present. */
  invite_address?: string | null
}

/** Matches OpenAPI QualifiedPartitionStats. */
export interface QualifiedPartitionsResponse {
  my_presale_rank: number
  target_rank: number | null
  threshold: number
  count: number
  direct_qualified_count: number
  team_qualified_count: number
  early_return: boolean
}

export type DaoRewardType =
  'RANK_REWARD' | 'REFERRAL_REWARD' | 'PARTICIPATION_REWARD' | 'SURPASS_REWARD' | 'LIFETIME_REWARD'

/** OpenAPI `/claim/dao-reward`: RANK=41 … LIFETIME=45 (supersedes handbook DaoPool signType=4). */
export const DAO_REWARD_SIGN_TYPE = {
  RANK_REWARD: 41n,
  REFERRAL_REWARD: 42n,
  PARTICIPATION_REWARD: 43n,
  SURPASS_REWARD: 44n,
  LIFETIME_REWARD: 45n,
} as const satisfies Record<DaoRewardType, bigint>

export type DaoGrantStatus = 'READY' | 'RESERVED' | 'PARTIALLY_CLAIMED' | 'CLAIMED' | 'CANCELLED'

export type BondFlowOperation = 'PURCHASE' | 'REDEEM' | 'REWARD' | 'RESTAKE'
export type BufferPoolEventType = 'RELEASE_CREATED' | 'PRINCIPAL_CLAIMED'
export type ReleasePoolEventType = 'entered_queue' | 'claimed' | 'released'
export type StakeFlowOperation = 'STAKE' | 'REWARD' | 'EXTRA_REWARD' | 'CLAIM_PRINCIPAL' | 'RESTAKE'
export type TurbineLogType = 'received' | 'silenced' | 'cooled_claimed'
export type X0MiningLogOperation = 'STAKE_X' | 'UNSTAKE_X' | 'REWARD'
export type X0MiningPositionOperation = 'STAKE_X' | 'UNSTAKE_X'

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

export interface ClaimSignatureServiceRequest {
  contract?: string
  account?: string
  amount?: string
  salt?: string
  expireTime?: number
  signType?: number
}

export interface ClaimSignatureServiceResponse {
  code?: number
  message?: string
  data?: string
}

export interface TeamRewardSignature {
  signature: string
  /**
   * On-chain claimReward(signType, amount, expireTime, salt, signature) needs
   * all of these; the backend signs over them, so they must be returned here.
   * Field names are matched flexibly in parseTeamRewardClaim.
   */
  salt?: string
  amount?: string
  amountWei?: string
  signType?: string | number
  expireTime?: string | number
  contract?: string
  account?: string
  rewardType?: DaoRewardType | string
  signatureServiceRequest?: ClaimSignatureServiceRequest | null
  signatureServiceResponse?: ClaimSignatureServiceResponse | null
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

/** POST /home/popup-notices — i18n 文案 */
export interface HomePopupNoticeI18n {
  locale: string
  title: string
  content: string
  image_url: string
}

/** POST /home/popup-notices — 原始 API 行 */
export interface HomePopupNoticeApiItem {
  id: number
  image_url: string
  link_url: string
  /** 0=当前页, 1=新标签 */
  link_target: number
  /** 1=只弹一次, 2=每次进首页都弹 */
  display_mode: number
  version: string
  sort_order: number
  start_time: string | null
  end_time: string | null
  i18n?: HomePopupNoticeI18n[]
}

export interface HomePopupNoticesResponse {
  items: HomePopupNoticeApiItem[]
}

/** 归一化后的首页公告（供 UI 消费） */
export interface HomePopupNotice {
  id: number
  version: string
  image_url: string | null
  title: string
  content: string
  link_url: string | null
  link_target: number
  /** true=访客关闭后不再弹出；false=每次进入首页都弹 */
  show_once: boolean
}

export interface MakingOverview {
  total_reward: string
  making_rank: number
  personal_position: string
  making_market: string
  small_market: string
  available_contribution: string
}

export interface StakeAddressCountStats {
  stake_address_count: number
}

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
  tx_hash: string | null
}

export interface AssetsHoldingsDistribution {
  stake_total_agx: string
  bond_lp: string
  bond_burn: string
  stake_x_pool: string
}

export interface AssetsHoldingsSummary {
  total_holdings_agx: string
  total_released_agx: string
  buffer_pool_cumulative: string
  buffer_pool_released: string
  buffer_pool_releasing: string
  stake_redeemed_agx: string
}

export interface AssetsRewardSummary {
  stake_invest_usd_value: string
  claimable_gagx: string
  market_fund_claimable_agx: string
  total_reward_claimed: string
  available_contribution: string
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

export interface BufferPoolSummary {
  cumulative_amount: string
  released_amount: string
  releasing_amount: string
}

export interface BufferPoolLogItem {
  block_time: number
  event_type: BufferPoolEventType
  amount: string
  contract_address: string
  tx_hash: string | null
}

export interface BufferPoolLogsParams extends PaginationParams {
  event_type?: BufferPoolEventType[]
}

export interface ClaimParseSignatureRequest {
  signature: string
  contract: string
  salt: string
  account: string
  amount: string
  expireTime: number
  signType: number
}

export interface ClaimParseSignatureResult {
  contract: string
  account: string
  amount: string
  amountDecimal: string
  salt: string
  saltRaw: string
  expireTime: number
  signType: number
  signature: string
  innerHash: string
  ethSignedHash: string
  recoveredSigner: string
  signatureServiceRequest?: ClaimSignatureServiceRequest
}

export interface LuckyRewardSummary {
  date: string
  today_total_prize: string
  is_winner: boolean
  win_count: number
}

export interface LuckyRewardMyRoundItem {
  date: string | null
  round_id: number
  participation_amount: string
  is_winner: boolean
  rank: number | null
  reward_amount: string
  draw_tx_hash: string | null
  winner_status: string | null
  claim_status: string | null
  claim_tx_hash: string | null
  claim_timestamp: number | null
}

export interface LuckyRewardWinnerItem {
  rank: number
  address: string
  participation_amount: string
  reward_amount: string
}

export interface LuckyRewardWinnersRequest {
  date: string
}

export interface LuckyRewardWinnersResponse {
  date: string
  draw_tx_hash: string | null
  items: LuckyRewardWinnerItem[]
}

export interface MarketAllowanceSummary {
  making_rank: number
  total_allowance: string
  total_claimed_allowance: string
  unlockable_allowance: string
  unlocked_claimable: string
}

export interface MarketAllowanceClaimLogItem {
  claim_time: number
  allowance_amount: string
  tx_hash: string | null
}

export interface MarketAllowancePaidLogItem {
  paid_time: number
  agx_amount: string
  operation_type: '质押' | '赎回'
  tx_hash: string | null
  subsidy_rate: string
  allowance_amount: string
}

export interface ParticipationAwardSummary {
  total_participation_reward: string
  active_stake_balance: string
  available_contribution: string
}

export interface ParticipationAwardLogItem {
  created_at: string | null
  status: DaoGrantStatus
  fully_claimed_at: string | null
  awarded_gross: string
}

export interface ParticipationAwardInviter {
  bound_at: string | null
  address: string
  active_stake_balance: string
  total_brought_reward: string
}

export interface ParticipationAwardInviterResponse {
  inviter: ParticipationAwardInviter | null
}

export interface RankRewardSummary {
  total_rank_reward: string
  making_market: string
  direct_referral_count: number
  effective_direct_referral_count: number
  making_rank: number
  active_stake_balance: string
  available_contribution: string
}

export interface RankRewardLogItem {
  benefit_level: number
  created_at: string | null
  status: DaoGrantStatus
  fully_claimed_at: string | null
  awarded_gross: string
}

export interface RankRewardPeerSurpassLogItem {
  benefit_level: number
  created_at: string | null
  status: DaoGrantStatus
  fully_claimed_at: string | null
  awarded_gross: string
}

export interface RankRewardTeamMemberItem {
  bound_at: string | null
  address: string
  making_market: string
  making_rank: number
}

export interface RankRewardTeamMembersParams extends PaginationParams {
  sort_time?: 'asc' | 'desc'
  hide_zero_market?: boolean
}

export interface ReferralAwardSummary {
  total_referral_reward: string
  active_stake_balance: string
  direct_referral_count: number
  available_contribution: string
}

export interface ReferralAwardLogItem {
  created_at: string | null
  status: DaoGrantStatus
  fully_claimed_at: string | null
  awarded_gross: string
}

export interface ReferralAwardDirectReferralItem {
  bound_at: string | null
  address: string
  active_stake_balance: string
  contributed_reward_total: string
}

export interface ReferralAwardDirectReferralsParams extends PaginationParams {
  hide_zero_position?: boolean
}

export interface ReleasePoolSummary {
  releasing_amount: string
  released_amount: string
  total_claimed_amount: string
}

export interface ReleasePoolLogItem {
  event_time: number
  event_type: ReleasePoolEventType
  amount: string
  tx_hash: string | null
  plan_index: number
}

export interface ReleasePoolLogsParams extends PaginationParams {
  event_type?: ReleasePoolEventType[]
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
