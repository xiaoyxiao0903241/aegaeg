import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getLuckyRewardMyRounds,
  getLuckyRewardSummary,
  getLuckyRewardWinners,
  getMarketAllowanceClaimLogs,
  getMarketAllowancePaidLogs,
  getMarketAllowanceSummary,
  getParticipationAwardInviter,
  getParticipationAwardLogs,
  getParticipationAwardSummary,
  getRankRewardLogs,
  getRankRewardPeerSurpassLogs,
  getRankRewardSummary,
  getRankRewardTeamMembers,
  getReferralAwardDirectReferrals,
  getReferralAwardLogs,
  getReferralAwardSummary,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type {
  PaginationParams,
  RankRewardTeamMembersParams,
  ReferralAwardDirectReferralsParams,
} from '~/shared/api/types'

export function useLuckyRewardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.luckyRewardSummary, getLuckyRewardSummary, enabled)
}

export function useLuckyRewardMyRounds(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.luckyRewardMyRounds({ page, page_size: pageSize }),
    (token) => getLuckyRewardMyRounds(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useLuckyRewardWinners(date: string | null | undefined, enabled = true) {
  const day = date?.trim() ?? ''

  return useAuthenticatedQuery(
    queryKeys.api.luckyRewardWinners(day || 'empty'),
    (token) => getLuckyRewardWinners(token, day),
    enabled && day.length > 0,
  )
}

export function useMarketAllowanceSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.marketAllowanceSummary,
    getMarketAllowanceSummary,
    enabled,
  )
}

export function useMarketAllowanceClaimLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.marketAllowanceClaimLogs({ page, page_size: pageSize }),
    (token) => getMarketAllowanceClaimLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useMarketAllowancePaidLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.marketAllowancePaidLogs({ page, page_size: pageSize }),
    (token) => getMarketAllowancePaidLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useParticipationAwardSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.participationAwardSummary,
    getParticipationAwardSummary,
    enabled,
  )
}

export function useParticipationAwardLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.participationAwardLogs({ page, page_size: pageSize }),
    (token) => getParticipationAwardLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useParticipationAwardInviter(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.participationAwardInviter,
    getParticipationAwardInviter,
    enabled,
  )
}

export function useRankRewardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.rankRewardSummary, getRankRewardSummary, enabled)
}

export function useRankRewardLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.rankRewardLogs({ page, page_size: pageSize }),
    (token) => getRankRewardLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useRankRewardPeerSurpassLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.rankRewardPeerSurpassLogs({ page, page_size: pageSize }),
    (token) => getRankRewardPeerSurpassLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useRankRewardTeamMembers(params: RankRewardTeamMembersParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.rankRewardTeamMembers(params),
    (token) => getRankRewardTeamMembers(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useReferralAwardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.referralAwardSummary, getReferralAwardSummary, enabled)
}

export function useReferralAwardLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.referralAwardLogs({ page, page_size: pageSize }),
    (token) => getReferralAwardLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useReferralAwardDirectReferrals(
  params: ReferralAwardDirectReferralsParams = {},
  enabled = true,
) {
  return useAuthenticatedQuery(
    queryKeys.api.referralAwardDirectReferrals(params),
    (token) => getReferralAwardDirectReferrals(token, params),
    enabled,
    { keepPreviousData: true },
  )
}
