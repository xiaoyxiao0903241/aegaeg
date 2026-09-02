import { postFilteredPage } from '~/shared/api/endpoints/_helpers'
import { apiRequest } from '~/shared/api/request'
import type {
  BufferPoolLogItem,
  BufferPoolLogsParams,
  BufferPoolSummary,
  Paginated,
  ReleasePoolLogItem,
  ReleasePoolLogsParams,
  ReleasePoolSummary,
} from '~/shared/api/types'

/** 本金释放页的汇总与日志端点，日志通过 `postFilteredPage` 过滤事件类型。 */

export async function getBufferPoolSummary(token: string): Promise<BufferPoolSummary> {
  return apiRequest<BufferPoolSummary>('/buffer-pool/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getBufferPoolLogs(
  token: string,
  params: BufferPoolLogsParams = {},
): Promise<Paginated<BufferPoolLogItem>> {
  return postFilteredPage('/buffer-pool/logs', token, params, 'event_type', params.event_type)
}

export async function getReleasePoolSummary(token: string): Promise<ReleasePoolSummary> {
  return apiRequest<ReleasePoolSummary>('/release-pool/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getReleasePoolLogs(
  token: string,
  params: ReleasePoolLogsParams = {},
): Promise<Paginated<ReleasePoolLogItem>> {
  return postFilteredPage('/release-pool/logs', token, params, 'event_type', params.event_type)
}
