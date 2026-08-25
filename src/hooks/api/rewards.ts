import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getDaoRewardTypeTotals,
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

/** 奖励域查询较多，这里集中暴露各汇总、流水与领取状态 hooks。 */

/**
 * 查询各类型 DAO 奖励待领取金额。
 *
 * 推荐 / 参与 / 共建 / 发展的 Hub 与子页待领预览用此汇总。
 *
 * @param enabled false 时暂停请求
 * @see docs/backend-api/api.md #dao-reward/type-totals
 */
export function useDaoRewardTypeTotals(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.daoRewardTypeTotals, getDaoRewardTypeTotals, enabled)
}

/**
 * 查询今日幸运奖汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useLuckyRewardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.luckyRewardSummary, getLuckyRewardSummary, enabled)
}

/**
 * 分页查询当前用户参与过的幸运奖轮次，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 查询幸运奖中奖名单。
 *
 * 未选日期时不传 `date`，由接口返回最新已开奖日与 `dates`。
 *
 * @param date 开奖日期（yyyy-MM-dd）；空则默认最新
 * @param enabled false 时暂停请求
 */
export function useLuckyRewardWinners(date: string | null | undefined, enabled = true) {
  const day = date?.trim() ?? ''

  return useAuthenticatedQuery(
    queryKeys.api.luckyRewardWinners(day || 'latest'),
    (token) => getLuckyRewardWinners(token, day || undefined),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 查询市场基金可领汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useMarketAllowanceSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.marketAllowanceSummary,
    getMarketAllowanceSummary,
    enabled,
  )
}

/**
 * 分页查询市场基金领取记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询市场基金已付记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 查询参与奖汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useParticipationAwardSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.participationAwardSummary,
    getParticipationAwardSummary,
    enabled,
  )
}

/**
 * 分页查询参与奖发放记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 查询当前用户的邀请人信息。
 *
 * @param enabled false 时暂停请求
 */
export function useParticipationAwardInviter(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.participationAwardInviter,
    getParticipationAwardInviter,
    enabled,
  )
}

/**
 * 查询等级共建奖汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useRankRewardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.rankRewardSummary, getRankRewardSummary, enabled)
}

/**
 * 分页查询等级共建奖发放记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询同级超越记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询等级共建团队成员，翻页时保留上一页数据。
 *
 * @param params 分页、排序与过滤参数
 * @param enabled false 时暂停请求
 */
export function useRankRewardTeamMembers(params: RankRewardTeamMembersParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.rankRewardTeamMembers(params),
    (token) => getRankRewardTeamMembers(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 查询推荐奖汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useReferralAwardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.referralAwardSummary, getReferralAwardSummary, enabled)
}

/**
 * 分页查询推荐奖发放记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询直接推荐用户，翻页时保留上一页数据。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
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
