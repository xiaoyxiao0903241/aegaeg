import type { CalcProduct } from '~/core/staking/staking-yield'

/**
 * 协议市值 / 总质押历史序列：UI 参数映射与图表点构建。
 *
 * `range` / `metric` 字面量与 `~/shared/api/types` 线契约一致（类型 SSOT 在 API types）。
 * 涨跌幅用接口 `latest_growth_rate`，不用序列首末点自行计算（year/all 抽稀后首点 ≠ 对比基准）。
 *
 * @see docs/backend-api/api.md #protocol-market-stats/series
 * @see docs/backend-api/api.md #protocol-market-stats/aggregate-series
 */

export type ProtocolMarketStatsSeriesRow = {
  date: string | number
  amount: string | number
}

export type ProtocolMarketStatsSeriesPayload = {
  list?: readonly ProtocolMarketStatsSeriesRow[] | null
  latest_growth_rate?: number | null
}

export type ProtocolMarketStatsChartPoint = {
  /** UTC 秒 */
  time: number
  value: number
  /** 接口原样 `date`（`yyyy-MM-dd` 或 `yyyy-MM`） */
  date?: string
}

export type ProtocolMarketStatsChart = {
  points: readonly ProtocolMarketStatsChartPoint[]
  lastValue: number | null
  percentChange: number | null
}

const RANGE_BY_INDEX = ['week', 'month', 'year', 'all'] as const

/**
 * 把文案 Segment 选中值映射为 API `range`。
 *
 * @param label 当前选中的文案
 * @param rangeLabels 与 `week/month/year/all` 同序的文案列表
 * @returns 对应 API range；未命中回落 `all`
 */
export function resolveProtocolMarketStatsRange(
  label: string,
  rangeLabels: readonly string[],
): (typeof RANGE_BY_INDEX)[number] {
  const idx = rangeLabels.indexOf(label)
  return RANGE_BY_INDEX[idx] ?? 'all'
}

/**
 * Hub 指标 Tab 映射为 API `metric`。
 *
 * @param uiMetric 页面指标键（`mcap` 或其它，如 `tvl`）
 * @returns `mcap` 返回 `market`，其余返回 `stake`
 */
export function resolveProtocolMarketStatsMetric(uiMetric: string): 'market' | 'stake' {
  return uiMetric === 'mcap' ? 'market' : 'stake'
}

/** 子页四条趋势：`POST /protocol-market-stats/aggregate-series` 的 `metric` */
export type ProtocolMarketStatsAggregateMetric = 'stake' | 'lp_bond' | 'burn_bond' | 'x_stake'

const AGGREGATE_METRIC_BY_PRODUCT = {
  stake: 'stake',
  lpbond: 'lp_bond',
  burnbond: 'burn_bond',
  xmine: 'x_stake',
} as const satisfies Record<CalcProduct, ProtocolMarketStatsAggregateMetric>

/**
 * 详情页产品映射为汇总趋势 `metric`。
 *
 * @param product 质押 / LP 债 / 销毁债 / X 挖矿
 * @returns 对应 API metric
 * @see docs/backend-api/api.md #protocol-market-stats/aggregate-series
 */
export function resolveProtocolMarketStatsAggregateMetric(
  product: CalcProduct,
): ProtocolMarketStatsAggregateMetric {
  return AGGREGATE_METRIC_BY_PRODUCT[product]
}

/**
 * 汇总趋势金额单位：`x_stake` 为 gAGX，其余为 AGX。
 *
 * @param metric aggregate-series `metric`
 * @returns 展示后缀（不含空格）
 */
export function protocolMarketStatsAggregateUnit(
  metric: ProtocolMarketStatsAggregateMetric,
): 'AGX' | 'gAGX' {
  return metric === 'x_stake' ? 'gAGX' : 'AGX'
}

/**
 * 解析序列日期为 UTC 秒；非法返回 null。
 * 支持 `yyyy-MM-dd`、`yyyy-MM`（当月 1 日）、unix 秒、unix 毫秒。
 *
 * @param date 原始日期值
 * @returns UTC 秒；非法输入返回 null
 * @see docs/backend-api/api.md #protocol-market-stats/series
 */
export function parseProtocolMarketStatsDate(date: string | number): number | null {
  if (typeof date === 'number') {
    if (!Number.isFinite(date) || date <= 0) return null
    return date > 1e12 ? Math.trunc(date / 1000) : Math.trunc(date)
  }
  const raw = date.trim()
  if (!raw) return null
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (ymd) {
    const y = Number(ymd[1])
    const m = Number(ymd[2])
    const d = Number(ymd[3])
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null
    return Date.UTC(y, m - 1, d) / 1000
  }
  const ym = /^(\d{4})-(\d{2})$/.exec(raw)
  if (ym) {
    const y = Number(ym[1])
    const m = Number(ym[2])
    if (!Number.isFinite(y) || !Number.isFinite(m)) return null
    return Date.UTC(y, m - 1, 1) / 1000
  }
  const asNum = Number(raw)
  if (Number.isFinite(asNum) && asNum > 0) {
    return asNum > 1e12 ? Math.trunc(asNum / 1000) : Math.trunc(asNum)
  }
  return null
}

function parseAmount(raw: string | number): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null
  const n = Number.parseFloat(String(raw).trim())
  return Number.isFinite(n) ? n : null
}

/**
 * 将 API 序列信封转为升序图表点；涨跌幅取 `latest_growth_rate`。
 * 非法 date/amount 行丢弃；缺数或非法增长率返回 null（UI 再显示 `+0.0%`）。
 *
 * @param payload `/series` 或 `/aggregate-series` 的 `data`
 * @returns 图表点、最新值、接口增长率
 */
export function buildProtocolMarketStatsChart(
  payload: ProtocolMarketStatsSeriesPayload | null | undefined,
): ProtocolMarketStatsChart {
  const points: ProtocolMarketStatsChartPoint[] = []
  for (const row of payload?.list ?? []) {
    const time = parseProtocolMarketStatsDate(row.date)
    const value = parseAmount(row.amount)
    if (time == null || value == null) continue
    const date = typeof row.date === 'string' ? row.date.trim() : undefined
    points.push(date ? { time, value, date } : { time, value })
  }
  points.sort((a, b) => a.time - b.time)

  const rate = payload?.latest_growth_rate
  const percentChange = rate == null || !Number.isFinite(rate) ? null : rate
  if (points.length === 0) {
    return { points: [], lastValue: null, percentChange }
  }

  const last = points[points.length - 1]!.value
  return { points, lastValue: last, percentChange }
}
