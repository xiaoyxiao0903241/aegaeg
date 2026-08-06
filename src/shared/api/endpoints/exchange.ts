import { paginationBody, postFilteredPage } from '~/shared/api/endpoints/_helpers'
import { apiRequest } from '~/shared/api/request'
import type {
  AgxContributionBurnLogItem,
  AgxContributionConsumeLogItem,
  AgxContributionSummary,
  Paginated,
  PaginationParams,
  TurbineLogItem,
  TurbineLogsParams,
  TurbineSummary,
} from '~/shared/api/types'

export async function getAgxContributionSummary(token: string): Promise<AgxContributionSummary> {
  return apiRequest<AgxContributionSummary>('/agx-contribution/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getAgxContributionBurnLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<AgxContributionBurnLogItem>> {
  return apiRequest<Paginated<AgxContributionBurnLogItem>>('/agx-contribution/burn-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getAgxContributionConsumeLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<AgxContributionConsumeLogItem>> {
  return apiRequest<Paginated<AgxContributionConsumeLogItem>>('/agx-contribution/consume-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getTurbineSummary(token: string): Promise<TurbineSummary> {
  return apiRequest<TurbineSummary>('/turbine/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getTurbineLogs(
  token: string,
  params: TurbineLogsParams = {},
): Promise<Paginated<TurbineLogItem>> {
  return postFilteredPage('/turbine/logs', token, params, 'turbine_type', params.turbine_type)
}
