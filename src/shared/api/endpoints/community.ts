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
  TeamReferralItem,
  TeamRewardClaimLogItem,
  UserPerformance,
} from '~/shared/api/types'

/** 社区与业绩端点统一走业务信封；搜索做市业绩不要求登录。 */

export async function getPerformance(token: string): Promise<UserPerformance> {
  return apiRequest<UserPerformance>('/performance', {
    method: 'POST',
    token,
    body: {},
  })
}

/**
 * 按地址搜索做市业绩，公开查询不要求登录。
 *
 * 请求体里的地址由调用方先规范化；未找到用户时后端按空业绩返回。
 *
 * @param address 待搜索的钱包地址
 * @returns 搜索到的用户业绩
 * @see docs/backend-api/api.md #一期接口/search-performance
 */
export async function searchPerformance(address: string): Promise<UserPerformance> {
  return apiRequest<UserPerformance>('/search/performance', {
    method: 'POST',
    body: { address },
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
