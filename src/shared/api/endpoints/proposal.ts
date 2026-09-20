import { paginationBody } from '~/shared/api/endpoints/_helpers'
import { apiRequest } from '~/shared/api/request'
import type {
  GovernanceDetail,
  GovernanceListItem,
  GovernanceMyOperationItem,
  GovernanceMyVoteItem,
  GovernanceStats,
  Paginated,
  PaginationParams,
} from '~/shared/api/types'

/**
 * 提案分页列表（标题 / i18n）。
 *
 * @param token 会话 JWT
 * @param locale 应用语言短码
 * @param params 分页
 * @see 用户文档 governance-apis #list
 */
export async function getGovernanceList(
  token: string,
  locale: string,
  params: PaginationParams = {},
): Promise<Paginated<GovernanceListItem>> {
  return apiRequest<Paginated<GovernanceListItem>>('/governance/list', {
    method: 'POST',
    token,
    body: { locale, ...paginationBody(params) },
  })
}

/**
 * 单提案标题与正文。
 *
 * @param token 会话 JWT
 * @param proposalId 提案 id
 * @param locale 应用语言短码
 * @see 用户文档 governance-apis #detail
 */
export async function getGovernanceDetail(
  token: string,
  proposalId: number,
  locale: string,
): Promise<GovernanceDetail> {
  return apiRequest<GovernanceDetail>('/governance/detail', {
    method: 'POST',
    token,
    body: { proposal_id: proposalId, locale },
  })
}

/**
 * 提案统计卡参与率。总数 / 进行中 / 即将开始走链上 getProposalStateSummary。
 *
 * @param token 会话 JWT
 * @see 用户文档 governance-apis #stats
 */
export async function getGovernanceStats(token: string): Promise<GovernanceStats> {
  return apiRequest<GovernanceStats>('/governance/stats', {
    method: 'POST',
    token,
    body: {},
  })
}

/**
 * 我的投票记录（一人一提案一行）。锁与可领取奖励叠链上仓位。
 *
 * @param token 会话 JWT
 * @param params 分页
 * @see 用户文档 governance-apis #my-votes
 */
export async function getGovernanceMyVotes(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<GovernanceMyVoteItem>> {
  return apiRequest<Paginated<GovernanceMyVoteItem>>('/governance/my-votes', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

/**
 * 我的提案操作记录（一笔投票一行）。奖励表整行吃后端，不叠链。
 *
 * @param token 会话 JWT
 * @param params 分页
 * @see 用户文档 governance-apis #my-operations
 */
export async function getGovernanceMyOperations(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<GovernanceMyOperationItem>> {
  return apiRequest<Paginated<GovernanceMyOperationItem>>('/governance/my-operations', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}
