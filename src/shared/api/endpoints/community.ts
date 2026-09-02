import { paginationBody } from '~/shared/api/endpoints/_helpers'
import { apiRequest } from '~/shared/api/request'
import type {
  CommunityFundLogItem,
  CommunityFundTotals,
  MakingOverview,
  Paginated,
  PaginationParams,
  QualifiedPartitionsResponse,
  RewardLogItem,
  RewardTotals,
  SalesLogItem,
  TeamCommunityOverview,
  TeamMakingOverview,
  TeamReferralItem,
  TeamRewardClaimLogItem,
  UserNodeType,
  UserPerformance,
} from '~/shared/api/types'

/** 社区与业绩端点统一走业务信封。 */

export async function getPerformance(token: string): Promise<UserPerformance> {
  return apiRequest<UserPerformance>('/performance', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getQualifiedPartitions(token: string): Promise<QualifiedPartitionsResponse> {
  return apiRequest<QualifiedPartitionsResponse>('/performance/qualified-partitions', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getMakingOverview(token: string): Promise<MakingOverview> {
  return apiRequest<MakingOverview>('/performance/making-overview', {
    method: 'POST',
    token,
    body: {},
  })
}

/**
 * 当前用户是否具备发展津贴领取资格。
 *
 * @param token 会话 JWT
 * @returns `is_user_node_type`
 * @see docs/backend-api/api.md #user/user-node-type
 */
export async function getUserNodeType(token: string): Promise<UserNodeType> {
  return apiRequest<UserNodeType>('/user/user-node-type', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getSalesLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<SalesLogItem>> {
  return apiRequest<Paginated<SalesLogItem>>('/sales/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getRewardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<RewardLogItem>> {
  return apiRequest<Paginated<RewardLogItem>>('/rewards/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getReferralTotal(token: string): Promise<RewardTotals> {
  return apiRequest<RewardTotals>('/referral/total', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getTeamRewardTotal(token: string): Promise<RewardTotals> {
  return apiRequest<RewardTotals>('/team-reward/total', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getCommunityFundTotal(token: string): Promise<CommunityFundTotals> {
  return apiRequest<CommunityFundTotals>('/community-fund/total', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getCommunityFundLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<CommunityFundLogItem>> {
  return apiRequest<Paginated<CommunityFundLogItem>>('/community-fund/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getTeamReferrals(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<TeamReferralItem>> {
  return apiRequest<Paginated<TeamReferralItem>>('/team/referrals', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getTeamOverview(token: string): Promise<TeamCommunityOverview> {
  return apiRequest<TeamCommunityOverview>('/team/overview', {
    method: 'POST',
    token,
    body: {},
  })
}

/**
 * 查询当前用户做市社区概览。
 *
 * @param token 登录 JWT
 * @returns 人数、USD 业绩与共建级别
 * @see docs/backend-api/api.md #team/making-overview
 */
export async function getTeamMakingOverview(token: string): Promise<TeamMakingOverview> {
  return apiRequest<TeamMakingOverview>('/team/making-overview', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getTeamRewardClaimLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<TeamRewardClaimLogItem>> {
  return apiRequest<Paginated<TeamRewardClaimLogItem>>('/team-reward/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}
