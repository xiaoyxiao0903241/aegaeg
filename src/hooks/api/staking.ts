/**
 * 质押域 API hooks：流水与协议市值序列均需登录。
 */
import {
  buildProtocolMarketStatsChart,
  resolveProtocolMarketStatsAggregateMetric,
  resolveProtocolMarketStatsMetric,
  resolveProtocolMarketStatsRange,
} from '~/core/staking/protocol-market-stats-series'
import type { CalcProduct } from '~/core/staking/staking-yield'
import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getBondFlowBurnLogs,
  getBondFlowBurnPurchases,
  getBondFlowBurnRewardTotal,
  getBondFlowLpLogs,
  getBondFlowLpPurchases,
  getBondFlowLpRewardTotal,
  getProtocolMarketStatsAggregateSeries,
  getProtocolMarketStatsSeries,
  getStakeAddressCount,
  getStakeFlowLogs,
  getStakeFlowPositions,
  getX0MiningLogs,
  getX0MiningPositions,
  getX0MiningSummary,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type {
  BondFlowLogsParams,
  PaginationParams,
  ProtocolMarketStatsAggregateMetric,
  ProtocolMarketStatsMetric,
  ProtocolMarketStatsRange,
  StakeFlowLogsParams,
  X0MiningLogsParams,
} from '~/shared/api/types'
import { sumX0MiningRewardAmountAcrossPages } from '~/shared/presenters/xmine-lifetime-reward'

/**
 * 查询活跃质押地址数。
 *
 * @param enabled false 时暂停请求
 */
export function useStakeAddressCount(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.stakeAddressCount, getStakeAddressCount, enabled)
}

/**
 * 协议总市值 / 总质押历史序列（需登录；未登录不发请求）。
 *
 * @param range API `range`
 * @param metric API `metric`
 * @param enabled false 时暂停请求
 * @returns 协议序列查询视图
 */
function useProtocolMarketStatsSeries(
  range: ProtocolMarketStatsRange,
  metric: ProtocolMarketStatsMetric,
  enabled = true,
) {
  return useAuthenticatedQuery(
    queryKeys.api.protocolMarketStatsSeries(range, metric),
    (token) => getProtocolMarketStatsSeries(token, { range, metric }),
    enabled,
    // 切 range/metric 时保留上一批，避免整图卸成 Skeleton 硬切
    { keepPreviousData: true },
  )
}

/**
 * 从 UI Segment 文案解析 range/metric 并拉取序列，构建图表点。
 *
 * @param chartRange 当前选中的时间范围文案（与 `rangeLabels` 对齐）
 * @param rangeLabels i18n `chartRanges`
 * @param uiMetric Hub：`tvl`/`mcap`
 * @param enabled false 时暂停请求
 * @returns API 查询视图，并附图表点、最新值与接口 `latest_growth_rate`
 */
export function useProtocolMarketStatsChart(
  chartRange: string,
  rangeLabels: readonly string[],
  uiMetric: string,
  enabled = true,
) {
  const range = resolveProtocolMarketStatsRange(chartRange, rangeLabels)
  const metric = resolveProtocolMarketStatsMetric(uiMetric)
  const seriesQuery = useProtocolMarketStatsSeries(range, metric, enabled)
  const chart = buildProtocolMarketStatsChart(seriesQuery.data)
  return {
    ...seriesQuery,
    points: chart.points,
    lastValue: chart.lastValue,
    percentChange: chart.percentChange,
  }
}

/**
 * 子页四类汇总趋势（需登录；未登录不发请求）。
 *
 * @param range API `range`
 * @param metric aggregate-series `metric`
 * @param enabled false 时暂停请求
 * @returns 汇总序列查询视图
 */
function useProtocolMarketStatsAggregateSeries(
  range: ProtocolMarketStatsRange,
  metric: ProtocolMarketStatsAggregateMetric,
  enabled = true,
) {
  return useAuthenticatedQuery(
    queryKeys.api.protocolMarketStatsAggregateSeries(range, metric),
    (token) => getProtocolMarketStatsAggregateSeries(token, { range, metric }),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 按详情页产品拉四类汇总趋势并构建图表点。
 *
 * @param chartRange 当前选中的时间范围文案（与 `rangeLabels` 对齐）
 * @param rangeLabels i18n `chartRanges`
 * @param product 质押 / LP 债 / 销毁债 / X 挖矿
 * @param enabled false 时暂停请求
 * @returns API 查询视图，并附图表点、最新值、接口增长率与 `metric`
 * @see docs/backend-api/api.md #protocol-market-stats/aggregate-series
 */
export function useProtocolMarketStatsAggregateChart(
  chartRange: string,
  rangeLabels: readonly string[],
  product: CalcProduct,
  enabled = true,
) {
  const range = resolveProtocolMarketStatsRange(chartRange, rangeLabels)
  const metric = resolveProtocolMarketStatsAggregateMetric(product)
  const seriesQuery = useProtocolMarketStatsAggregateSeries(range, metric, enabled)
  const chart = buildProtocolMarketStatsChart(seriesQuery.data)
  return {
    ...seriesQuery,
    metric,
    points: chart.points,
    lastValue: chart.lastValue,
    percentChange: chart.percentChange,
  }
}

/**
 * 分页查询债券 LP 流水，支持按操作类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useBondFlowLpLogs(params: BondFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowLpLogs(params),
    (token) => getBondFlowLpLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 已领取 LP 债券收益合计（gAGX）。页面总收益还要加链上未领 Rebase。
 *
 * @param enabled false 时暂停请求
 */
export function useBondFlowLpRewardTotal(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowLpRewardTotal,
    getBondFlowLpRewardTotal,
    enabled,
  )
}

/**
 * 已领取销毁债券收益合计（gAGX）。页面总收益还要加链上未领 Rebase。
 *
 * @param enabled false 时暂停请求
 */
export function useBondFlowBurnRewardTotal(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowBurnRewardTotal,
    getBondFlowBurnRewardTotal,
    enabled,
  )
}

/**
 * 分页查询债券销毁流水，支持按操作类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useBondFlowBurnLogs(params: BondFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowBurnLogs(params),
    (token) => getBondFlowBurnLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询债券 LP 购买记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询债券销毁购买记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询质押流水，支持按操作类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useStakeFlowLogs(params: StakeFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.stakeFlowLogs(params),
    (token) => getStakeFlowLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询质押持仓，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询 X 挖矿流水，支持按操作类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useX0MiningLogs(params: X0MiningLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.x0MiningLogs(params),
    (token) => getX0MiningLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 用户 X 挖矿终身 REWARD 产出：翻页累加至覆盖 `total` 或末页。
 *
 * @param enabled false 时暂停请求
 */
export function useX0MiningLifetimeReward(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.x0MiningLifetimeReward,
    (token) =>
      sumX0MiningRewardAmountAcrossPages({
        pageSize: 100,
        fetchPage: (page, pageSize) =>
          getX0MiningLogs(token, { operation: ['REWARD'], page, page_size: pageSize }),
      }),
    enabled,
  )
}

/**
 * 个人 X 挖矿概览：已释放 gAGX 与已领取 X。
 *
 * @param enabled false 时暂停请求
 * @see docs/backend-api/api.md #x0-mining/summary
 */
export function useX0MiningSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.x0MiningSummary, getX0MiningSummary, enabled)
}

/**
 * 分页查询 X 挖矿持仓，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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
