import { paginationBody, postFilteredPage } from '~/shared/api/endpoints/_helpers'
import { apiRequest } from '~/shared/api/request'
import type {
  BondFlowLogItem,
  BondFlowLogsParams,
  BondPurchasesPage,
  Paginated,
  PaginationParams,
  StakeAddressCountStats,
  StakeFlowLogItem,
  StakeFlowLogsParams,
  StakePositionsPage,
  X0MiningLogItem,
  X0MiningLogsParams,
  X0MiningPositionsPage,
} from '~/shared/api/types'

export async function getStakeAddressCount(token: string): Promise<StakeAddressCountStats> {
  return apiRequest<StakeAddressCountStats>('/performance/stake-address-count', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getBondFlowLpLogs(
  token: string,
  params: BondFlowLogsParams = {},
): Promise<Paginated<BondFlowLogItem>> {
  return postFilteredPage('/bond-flow/lp-logs', token, params, 'operation', params.operation)
}

export async function getBondFlowBurnLogs(
  token: string,
  params: BondFlowLogsParams = {},
): Promise<Paginated<BondFlowLogItem>> {
  return postFilteredPage('/bond-flow/burn-logs', token, params, 'operation', params.operation)
}

export async function getBondFlowLpPurchases(
  token: string,
  params: PaginationParams = {},
): Promise<BondPurchasesPage> {
  return apiRequest<BondPurchasesPage>('/bond-flow/lp-purchases', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getBondFlowBurnPurchases(
  token: string,
  params: PaginationParams = {},
): Promise<BondPurchasesPage> {
  return apiRequest<BondPurchasesPage>('/bond-flow/burn-purchases', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getStakeFlowLogs(
  token: string,
  params: StakeFlowLogsParams = {},
): Promise<Paginated<StakeFlowLogItem>> {
  return postFilteredPage('/stake-flow/logs', token, params, 'operation', params.operation)
}

export async function getStakeFlowPositions(
  token: string,
  params: PaginationParams = {},
): Promise<StakePositionsPage> {
  return apiRequest<StakePositionsPage>('/stake-flow/positions', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getX0MiningLogs(
  token: string,
  params: X0MiningLogsParams = {},
): Promise<Paginated<X0MiningLogItem>> {
  return postFilteredPage('/x0-mining/logs', token, params, 'operation', params.operation)
}

export async function getX0MiningPositions(
  token: string,
  params: PaginationParams = {},
): Promise<X0MiningPositionsPage> {
  return apiRequest<X0MiningPositionsPage>('/x0-mining/positions', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}
