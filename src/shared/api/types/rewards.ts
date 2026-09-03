import type { DaoGrantStatus } from '~/shared/api/types/claim'
import type { MakingRankBoost, PaginationParams } from '~/shared/api/types/common'

export interface LuckyRewardSummary {
  date: string
  today_total_prize: string
  is_winner: boolean
  win_count: number
  /** 累计中奖金额（AGX） */
  total_reward_amount: string
}

export interface LuckyRewardMyRoundItem {
  date: string | null
  round_id: number
  participation_amount: string
  is_winner: boolean
  rank: number | null
  reward_amount: string
  draw_tx_hash: string | null
}

export interface LuckyRewardWinnerItem {
  rank: number
  address: string
  participation_amount: string
  reward_amount: string
}

export interface LuckyRewardWinnersResponse {
  date: string | null
  /** 当日最大 DRAWN round_id；无轮次为 null。质押金额按此 round 读 Tracker.getUserRoundStat */
  round_id: number | null
  draw_tx_hash: string | null
  /** 已开奖日期，供日历选择；不含尚未开奖的当天 */
  dates: string[]
  items: LuckyRewardWinnerItem[]
}

export interface MarketAllowanceSummary extends MakingRankBoost {
  total_allowance: string
  total_claimed_allowance: string
  unlockable_allowance: string
  unlocked_claimable: string
}

/** 各类型 DAO 待领金额（十进制 AGX）。Hub 共建卡 = RANK_REWARD + SURPASS_REWARD。 */
export interface DaoRewardTypeTotals {
  RANK_REWARD: string
  REFERRAL_REWARD: string
  PARTICIPATION_REWARD: string
  SURPASS_REWARD: string
  LIFETIME_REWARD: string
  LUCKY_REWARD: string
  MARKET_FUND: string
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

export interface RankRewardSummary extends MakingRankBoost {
  total_rank_reward: string
  making_market: string
  direct_referral_count: number
  effective_direct_referral_count: number
  active_stake_balance: string
  available_contribution: string
  /** 直推生效等级 ≥ max(R−1, 0) 的人数（含托底） */
  qualified_direct_rank_count: number
  /** 双线是否达成：`qualified_direct_rank_count` ≥ 2 */
  is_dual_line_qualified: boolean
  /** 其他线业绩（AGX） */
  other_lines_market: string
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
  sort_bound_at?: 'asc' | 'desc'
  sort_making_market?: 'asc' | 'desc'
  sort_making_rank?: 'asc' | 'desc'
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
