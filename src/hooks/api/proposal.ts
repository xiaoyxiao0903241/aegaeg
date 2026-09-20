import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getGovernanceDetail,
  getGovernanceList,
  getGovernanceMyOperations,
  getGovernanceMyVotes,
  getGovernanceStats,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { PaginationParams } from '~/shared/api/types'

/**
 * 提案分页列表。
 *
 * @param locale 应用语言短码
 * @param params 分页
 * @param enabled false 时暂停请求
 */
export function useGovernanceList(locale: string, params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size
  return useAuthenticatedQuery(
    queryKeys.api.governanceList(locale, { page, page_size: pageSize }),
    (token) => getGovernanceList(token, locale, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 单提案标题与正文。
 *
 * @param proposalId 提案 id；null 时不请求
 * @param locale 应用语言短码
 * @param enabled false 时暂停请求
 */
export function useGovernanceDetail(proposalId: number | null, locale: string, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.governanceDetail(proposalId ?? 0, locale),
    (token) => getGovernanceDetail(token, proposalId ?? 0, locale),
    enabled && proposalId != null && proposalId > 0,
  )
}

/**
 * 提案页参与率（近 10 项）。总数卡走链上汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useGovernanceStats(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.governanceStats, getGovernanceStats, enabled)
}

/**
 * 我的投票记录。
 *
 * @param params 分页
 * @param enabled false 时暂停请求
 */
export function useGovernanceMyVotes(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size
  return useAuthenticatedQuery(
    queryKeys.api.governanceMyVotes({ page, page_size: pageSize }),
    (token) => getGovernanceMyVotes(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 我的提案操作记录（奖励表）。
 *
 * @param params 分页
 * @param enabled false 时暂停请求
 */
export function useGovernanceMyOperations(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size
  return useAuthenticatedQuery(
    queryKeys.api.governanceMyOperations({ page, page_size: pageSize }),
    (token) => getGovernanceMyOperations(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}
