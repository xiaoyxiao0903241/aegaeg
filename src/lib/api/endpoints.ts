import { apiRequest } from '~/lib/api/request'
import type {
  ClaimConfirmRequest,
  ClaimConfirmResult,
  LoginRequest,
  LoginResponse,
  Paginated,
  PaginationParams,
  RewardLogItem,
  RewardTotals,
  SalesLogItem,
  TeamCommunityOverview,
  TeamReferralItem,
  TeamRewardClaimLogItem,
  TeamRewardSignature,
  UserPerformance,
} from '~/lib/api/types'

function paginationBody(params: PaginationParams = {}) {
  return {
    page: params.page ?? 1,
    page_size: params.page_size ?? 20,
  }
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: request,
  })
}

export async function getPerformance(token: string): Promise<UserPerformance> {
  return apiRequest<UserPerformance>('/performance', {
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

export async function requestTeamRewardSignature(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/team-reward', {
    method: 'POST',
    token,
    body: {},
  })
}

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
