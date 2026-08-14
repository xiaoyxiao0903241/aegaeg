import { paginationBody, postFilteredPage } from '~/shared/api/endpoints/_helpers'
import { apiRequest } from '~/shared/api/request'
import type {
  BondFlowLogItem,
  BondFlowLogsParams,
  BondPurchasesPage,
  Paginated,
  PaginationParams,
  ProtocolMarketStatsAggregateData,
  ProtocolMarketStatsAggregateParams,
  ProtocolMarketStatsSeriesData,
  ProtocolMarketStatsSeriesParams,
  StakeAddressCountStats,
  StakeFlowLogItem,
  StakeFlowLogsParams,
  StakePositionsPage,
  X0MiningLogItem,
  X0MiningLogsParams,
  X0MiningPositionsPage,
} from '~/shared/api/types'

/** 质押、债券与 X 挖矿端点按指标与流水分组封装。 */

export async function getStakeAddressCount(token: string): Promise<StakeAddressCountStats> {
  return apiRequest<StakeAddressCountStats>('/performance/stake-address-count', {
    method: 'POST',
    token,
    body: {},
  })
}

/**
 * 协议总市值 / 总质押历史序列（需登录）。
 *
 * 解包 `data` 为 `{ metric, range, list, latest_growth_rate }`，点列在 `list`。
 *
 * @see docs/backend-api/api.md #protocol-market-stats/series
 */
export async function getProtocolMarketStatsSeries(
  token: string,
  params: ProtocolMarketStatsSeriesParams,
): Promise<ProtocolMarketStatsSeriesData> {
  return apiRequest<ProtocolMarketStatsSeriesData>('/protocol-market-stats/series', {
    method: 'POST',
    token,
    body: {
      range: params.range,
      metric: params.metric,
    },
  })
}

/**
 * 四类汇总趋势（质押 / LP 债 / 销毁债 / X 池）。
 *
 * 解包 `data` 为 `{ metric, range, mode, list, latest_growth_rate }`；默认 `mode=balance`。
 *
 * @see docs/backend-api/api.md #protocol-market-stats/aggregate-series
 */
export async function getProtocolMarketStatsAggregateSeries(
  token: string,
  params: ProtocolMarketStatsAggregateParams,
): Promise<ProtocolMarketStatsAggregateData> {
  return apiRequest<ProtocolMarketStatsAggregateData>('/protocol-market-stats/aggregate-series', {
    method: 'POST',
    token,
    body: {
      metric: params.metric,
      range: params.range,
    },
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
