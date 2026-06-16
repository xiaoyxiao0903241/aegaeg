import { apiRequest } from './request'
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
  TeamReferralItem,
  TeamRewardClaimLogItem,
  TeamRewardSignature,
  UserPerformance,
} from './types'

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: request,
  })
}

export async function getPerformance(token: string): Promise<UserPerformance> {
  return apiRequest<UserPerformance>('/performance', { token })
}

export async function getSalesLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<SalesLogItem>> {
  return apiRequest<Paginated<SalesLogItem>>('/sales/logs', {
    token,
    searchParams: {
      page: params.page,
      page_size: params.page_size,
    },
  })
}

export async function getRewardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<RewardLogItem>> {
  return apiRequest<Paginated<RewardLogItem>>('/rewards/logs', {
    token,
    searchParams: {
      page: params.page,
      page_size: params.page_size,
    },
  })
}

export async function getReferralTotal(token: string): Promise<RewardTotals> {
  return apiRequest<RewardTotals>('/referral/total', { token })
}

export async function getTeamRewardTotal(token: string): Promise<RewardTotals> {
  return apiRequest<RewardTotals>('/team-reward/total', { token })
}

export async function getTeamReferrals(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<TeamReferralItem>> {
  return apiRequest<Paginated<TeamReferralItem>>('/team/referrals', {
    token,
    searchParams: {
      page: params.page,
      page_size: params.page_size,
    },
  })
}

export async function getTeamRewardClaimLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<TeamRewardClaimLogItem>> {
  return apiRequest<Paginated<TeamRewardClaimLogItem>>('/team-reward/logs', {
    token,
    searchParams: {
      page: params.page,
      page_size: params.page_size,
    },
  })
}

export async function requestTeamRewardSignature(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/team-reward', {
    method: 'POST',
    token,
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
