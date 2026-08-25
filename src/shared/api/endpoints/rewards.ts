import { paginationBody } from '~/shared/api/endpoints/_helpers'
import { apiRequest } from '~/shared/api/request'
import type {
  ClaimConfirmRequest,
  ClaimConfirmResult,
  DaoRewardType,
  DaoRewardTypeTotals,
  LuckyRewardMyRoundItem,
  LuckyRewardSummary,
  LuckyRewardWinnersResponse,
  MarketAllowanceClaimLogItem,
  MarketAllowancePaidLogItem,
  MarketAllowanceSummary,
  Paginated,
  PaginationParams,
  ParticipationAwardInviterResponse,
  ParticipationAwardLogItem,
  ParticipationAwardSummary,
  RankRewardLogItem,
  RankRewardPeerSurpassLogItem,
  RankRewardSummary,
  RankRewardTeamMemberItem,
  RankRewardTeamMembersParams,
  ReferralAwardDirectReferralItem,
  ReferralAwardDirectReferralsParams,
  ReferralAwardLogItem,
  ReferralAwardSummary,
  TeamRewardSignature,
} from '~/shared/api/types'

/** 奖励页端点跨度较大：汇总、流水、领取签名与确认都走统一信封。 */

/**
 * 查询当前用户各类型 DAO 奖励待领取金额。
 *
 * Hub 一次拉全量，不传 type。共建卡在映射层把 RANK 与 SURPASS 相加。
 *
 * @param token 会话 token
 * @returns 各 reward_type 待领十进制金额
 * @see docs/backend-api/api.md #dao-reward/type-totals
 */
export async function getDaoRewardTypeTotals(token: string): Promise<DaoRewardTypeTotals> {
  return apiRequest<DaoRewardTypeTotals>('/dao-reward/type-totals', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getLuckyRewardSummary(token: string): Promise<LuckyRewardSummary> {
  return apiRequest<LuckyRewardSummary>('/lucky-reward/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getLuckyRewardMyRounds(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<LuckyRewardMyRoundItem>> {
  return apiRequest<Paginated<LuckyRewardMyRoundItem>>('/lucky-reward/my-rounds', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getLuckyRewardWinners(
  token: string,
  date?: string,
): Promise<LuckyRewardWinnersResponse> {
  const day = date?.trim() ?? ''
  return apiRequest<LuckyRewardWinnersResponse>('/lucky-reward/winners', {
    method: 'POST',
    token,
    body: day ? { date: day } : {},
  })
}

export async function getMarketAllowanceSummary(token: string): Promise<MarketAllowanceSummary> {
  return apiRequest<MarketAllowanceSummary>('/market-allowance/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getMarketAllowanceClaimLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<MarketAllowanceClaimLogItem>> {
  return apiRequest<Paginated<MarketAllowanceClaimLogItem>>('/market-allowance/claim-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getMarketAllowancePaidLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<MarketAllowancePaidLogItem>> {
  return apiRequest<Paginated<MarketAllowancePaidLogItem>>('/market-allowance/paid-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getParticipationAwardSummary(
  token: string,
): Promise<ParticipationAwardSummary> {
  return apiRequest<ParticipationAwardSummary>('/participation-award/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getParticipationAwardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<ParticipationAwardLogItem>> {
  return apiRequest<Paginated<ParticipationAwardLogItem>>('/participation-award/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getParticipationAwardInviter(
  token: string,
): Promise<ParticipationAwardInviterResponse> {
  return apiRequest<ParticipationAwardInviterResponse>('/participation-award/inviter', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getRankRewardSummary(token: string): Promise<RankRewardSummary> {
  return apiRequest<RankRewardSummary>('/rank-reward/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getRankRewardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<RankRewardLogItem>> {
  return apiRequest<Paginated<RankRewardLogItem>>('/rank-reward/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getRankRewardPeerSurpassLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<RankRewardPeerSurpassLogItem>> {
  return apiRequest<Paginated<RankRewardPeerSurpassLogItem>>('/rank-reward/peer-surpass-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getRankRewardTeamMembers(
  token: string,
  params: RankRewardTeamMembersParams = {},
): Promise<Paginated<RankRewardTeamMemberItem>> {
  return apiRequest<Paginated<RankRewardTeamMemberItem>>('/rank-reward/team-members', {
    method: 'POST',
    token,
    body: {
      ...paginationBody(params),
      ...(params.sort_bound_at !== undefined ? { sort_bound_at: params.sort_bound_at } : {}),
      ...(params.sort_making_market !== undefined
        ? { sort_making_market: params.sort_making_market }
        : {}),
      ...(params.sort_making_rank !== undefined
        ? { sort_making_rank: params.sort_making_rank }
        : {}),
      ...(params.hide_zero_market !== undefined
        ? { hide_zero_market: params.hide_zero_market }
        : {}),
    },
  })
}

export async function getReferralAwardSummary(token: string): Promise<ReferralAwardSummary> {
  return apiRequest<ReferralAwardSummary>('/referral-award/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getReferralAwardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<ReferralAwardLogItem>> {
  return apiRequest<Paginated<ReferralAwardLogItem>>('/referral-award/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getReferralAwardDirectReferrals(
  token: string,
  params: ReferralAwardDirectReferralsParams = {},
): Promise<Paginated<ReferralAwardDirectReferralItem>> {
  return apiRequest<Paginated<ReferralAwardDirectReferralItem>>(
    '/referral-award/direct-referrals',
    {
      method: 'POST',
      token,
      body: {
        ...paginationBody(params),
        ...(params.hide_zero_position !== undefined
          ? { hide_zero_position: params.hide_zero_position }
          : {}),
      },
    },
  )
}

/** 请求团队奖励领取签名。 */
export async function requestTeamRewardSignature(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/team-reward', {
    method: 'POST',
    token,
    body: {},
  })
}

/** 请求社区基金领取签名。 */
export async function requestCommunityFundClaim(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/community-fund', {
    method: 'POST',
    token,
    body: {},
  })
}

/** 请求 DAO 奖励领取签名。 */
export async function requestDaoClaim(
  token: string,
  rewardType: DaoRewardType,
): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/dao-reward', {
    method: 'POST',
    token,
    body: { rewardType },
  })
}

/** 请求市场基金领取签名。 */
export async function requestMarketFundClaim(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/market-fund', {
    method: 'POST',
    token,
    body: {},
  })
}

/** 向后端确认团队奖励领取结果。 */
export async function confirmTeamRewardClaim(
  token: string,
  request: ClaimConfirmRequest,
): Promise<ClaimConfirmResult> {
  return apiRequest<ClaimConfirmResult>('/claim/confirm', {
    method: 'POST',
    token,
    body: request,
  })
}
