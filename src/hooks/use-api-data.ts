import { useQuery, type QueryKey } from '@tanstack/react-query'
import {
  getAgxContributionBurnLogs,
  getAgxContributionConsumeLogs,
  getAgxContributionSummary,
  getAssetsHoldingsDistribution,
  getAssetsHoldingsSummary,
  getAssetsRewardSummary,
  getBondFlowBurnLogs,
  getBondFlowBurnPurchases,
  getBondFlowLpLogs,
  getBondFlowLpPurchases,
  getBufferPoolLogs,
  getBufferPoolSummary,
  getCommunityFundLogs,
  getCommunityFundTotal,
  getLuckyRewardMyRounds,
  getLuckyRewardSummary,
  getLuckyRewardWinners,
  getMakingOverview,
  getMarketAllowanceClaimLogs,
  getMarketAllowancePaidLogs,
  getMarketAllowanceSummary,
  getParticipationAwardInviter,
  getParticipationAwardLogs,
  getParticipationAwardSummary,
  getPerformance,
  getQualifiedPartitions,
  getRankRewardLogs,
  getRankRewardPeerSurpassLogs,
  getRankRewardSummary,
  getRankRewardTeamMembers,
  getReferralAwardDirectReferrals,
  getReferralAwardLogs,
  getReferralAwardSummary,
  getReferralTotal,
  getReleasePoolLogs,
  getReleasePoolSummary,
  getRewardLogs,
  getSalesLogs,
  getStakeAddressCount,
  getStakeFlowLogs,
  getStakeFlowPositions,
  getTeamOverview,
  getTeamReferrals,
  getTeamRewardClaimLogs,
  getTeamRewardTotal,
  getTurbineLogs,
  getTurbineSummary,
  getX0MiningLogs,
  getX0MiningPositions,
  searchPerformance,
} from '~/shared/api/endpoints'
import type {
  BondFlowLogsParams,
  BufferPoolLogsParams,
  PaginationParams,
  RankRewardTeamMembersParams,
  ReferralAwardDirectReferralsParams,
  ReleasePoolLogsParams,
  StakeFlowLogsParams,
  TurbineLogsParams,
  X0MiningLogsParams,
} from '~/shared/api/types'
import {
  requestWithSession,
  toQueryErrorMessage,
  canRunAuthenticatedQuery,
} from '~/shared/api/query/session-request'
import type { ApiUserFacingErrorMessages } from '~/shared/api/api-user-facing-error'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import { useAuthStore } from '~/stores/auth-store'
import { normalizeAuthAddress } from '~/core/auth/types'

function useAuthenticatedQuery<T>(
  queryKey: QueryKey,
  fetcher: (token: string) => Promise<T>,
  enabled = true,
  options?: { keepPreviousData?: boolean },
) {
  const { token, invalidateSession, sessionReady, hasHydrated, session } = useAuth()
  const { messages: t } = useI18n()
  // Address-scoped key: JWT renew keeps cache; wallet switch isolates accounts.
  const scopeKey = session?.address ? normalizeAuthAddress(session.address) : undefined

  const query = useQuery({
    queryKey: scopeKey ? [...queryKey, scopeKey] : queryKey,
    queryFn: () => {
      // Prefer store token so silent renew updates mid-flight refetch without waiting for re-render.
      const latestToken = scopeKey
        ? (useAuthStore.getState().sessionsByAddress[scopeKey]?.token ?? token)
        : token
      if (!latestToken) {
        throw new Error('Authenticated query ran without a session token')
      }
      return requestWithSession(fetcher, latestToken, invalidateSession)
    },
    enabled: canRunAuthenticatedQuery({
      enabled,
      hasHydrated,
      sessionReady,
      hasToken: Boolean(token),
    }),
    staleTime: QUERY_STALE_TIME.api,
    placeholderData: options?.keepPreviousData
      ? (previousData, previousQuery) => {
          if (previousData == null || !scopeKey) return undefined
          if (previousQuery == null) return undefined
          const previousScope = previousQuery.queryKey.at(-1)
          if (previousScope !== scopeKey) return undefined
          return previousData
        }
      : undefined,
  })

  return toApiQueryView(query, t.errors.api)
}

function toApiQueryView<T>(
  query: {
    data: T | undefined
    error: unknown
    isLoading: boolean
    refetch: () => Promise<unknown>
  },
  apiErrorMessages: ApiUserFacingErrorMessages,
) {
  return {
    data: query.data ?? null,
    error: toQueryErrorMessage(query.error, apiErrorMessages),
    isLoading: query.isLoading,
    refresh: async () => {
      await query.refetch()
    },
  }
}

export function usePerformance(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.performance, getPerformance, enabled)
}

export function useSearchPerformance(address: string | null | undefined, enabled = true) {
  const { messages: t } = useI18n()
  const normalized = address?.trim() ?? ''
  const query = useQuery({
    queryKey: queryKeys.api.searchPerformance(normalized || 'empty'),
    queryFn: () => searchPerformance(normalized),
    enabled: enabled && normalized.length > 0,
    staleTime: QUERY_STALE_TIME.api,
  })

  return toApiQueryView(query, t.errors.api)
}

export function useQualifiedPartitions(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.qualifiedPartitions, getQualifiedPartitions, enabled)
}

export function useMakingOverview(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.makingOverview, getMakingOverview, enabled)
}

export function useStakeAddressCount(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.stakeAddressCount, getStakeAddressCount, enabled)
}

export function useSalesLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.salesLogs({ page, page_size: pageSize }),
    (token) => getSalesLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useRewardLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.rewardLogs({ page, page_size: pageSize }),
    (token) => getRewardLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useReferralTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.referralTotal, getReferralTotal, enabled)
}

export function useTeamRewardTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.teamRewardTotal, getTeamRewardTotal, enabled)
}

export function useCommunityFundTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.communityFundTotal, getCommunityFundTotal, enabled)
}

export function useCommunityFundLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.communityFundLogs({ page, page_size: pageSize }),
    (token) => getCommunityFundLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useTeamRewardClaimLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.teamRewardClaimLogs({ page, page_size: pageSize }),
    (token) => getTeamRewardClaimLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useTeamReferrals(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.teamReferrals({ page, page_size: pageSize }),
    (token) => getTeamReferrals(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useTeamOverview(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.teamOverview, getTeamOverview, enabled)
}

export function useAgxContributionSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.agxContributionSummary,
    getAgxContributionSummary,
    enabled,
  )
}

export function useAgxContributionBurnLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.agxContributionBurnLogs({ page, page_size: pageSize }),
    (token) => getAgxContributionBurnLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useAgxContributionConsumeLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.agxContributionConsumeLogs({ page, page_size: pageSize }),
    (token) => getAgxContributionConsumeLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useAssetsHoldingsDistribution(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.assetsHoldingsDistribution,
    getAssetsHoldingsDistribution,
    enabled,
  )
}

export function useAssetsHoldingsSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.assetsHoldingsSummary,
    getAssetsHoldingsSummary,
    enabled,
  )
}

export function useAssetsRewardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.assetsRewardSummary, getAssetsRewardSummary, enabled)
}

export function useBondFlowLpLogs(params: BondFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowLpLogs(params),
    (token) => getBondFlowLpLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useBondFlowBurnLogs(params: BondFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowBurnLogs(params),
    (token) => getBondFlowBurnLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useBondFlowLpPurchases(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.bondFlowLpPurchases({ page, page_size: pageSize }),
    (token) => getBondFlowLpPurchases(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useBondFlowBurnPurchases(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.bondFlowBurnPurchases({ page, page_size: pageSize }),
    (token) => getBondFlowBurnPurchases(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useBufferPoolSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.bufferPoolSummary, getBufferPoolSummary, enabled)
}

export function useBufferPoolLogs(params: BufferPoolLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bufferPoolLogs(params),
    (token) => getBufferPoolLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

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

export function useReleasePoolSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.releasePoolSummary, getReleasePoolSummary, enabled)
}

export function useReleasePoolLogs(params: ReleasePoolLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.releasePoolLogs(params),
    (token) => getReleasePoolLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useStakeFlowLogs(params: StakeFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.stakeFlowLogs(params),
    (token) => getStakeFlowLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useStakeFlowPositions(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.stakeFlowPositions({ page, page_size: pageSize }),
    (token) => getStakeFlowPositions(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useTurbineSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.turbineSummary, getTurbineSummary, enabled)
}

export function useTurbineLogs(params: TurbineLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.turbineLogs(params),
    (token) => getTurbineLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useX0MiningLogs(params: X0MiningLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.x0MiningLogs(params),
    (token) => getX0MiningLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useX0MiningPositions(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.x0MiningPositions({ page, page_size: pageSize }),
    (token) => getX0MiningPositions(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}
