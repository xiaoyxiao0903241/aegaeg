/**
 * 协议市值 / 总质押历史序列：UI 参数映射与图表点构建。
 *
 * `range` / `metric` 字面量与 `~/shared/api/types` 线契约一致（类型 SSOT 在 API types）。
 *
 * @see docs/backend-api/api.md #protocol-market-stats/series
 */

export type ProtocolMarketStatsSeriesRow = {
  date: string | number
  amount: string | number
}

export type ProtocolMarketStatsChartPoint = {
  /** UTC 秒 */
  time: number
  value: number
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

/**
 * 解析序列日期为 UTC 秒；非法返回 null。
 * 支持 `yyyy-MM-dd`、unix 秒、unix 毫秒。
 *
 * @param date 原始日期值
 * @returns UTC 秒；非法输入返回 null
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
 * 将 API 序列转为升序图表点，并派生最新值与首末涨跌幅。
 * 非法 date/amount 行丢弃；首点 ≤0 时涨跌幅为 null。
 *
 * @param rows API 序列行
 * @returns 图表点与最新值、涨跌幅
 */
export function buildProtocolMarketStatsChart(
  rows: readonly ProtocolMarketStatsSeriesRow[],
): ProtocolMarketStatsChart {
  const points: ProtocolMarketStatsChartPoint[] = []
  for (const row of rows) {
    const time = parseProtocolMarketStatsDate(row.date)
    const value = parseAmount(row.amount)
    if (time == null || value == null) continue
    points.push({ time, value })
  }
  points.sort((a, b) => a.time - b.time)

  if (points.length === 0) {
    return { points: [], lastValue: null, percentChange: null }
  }

  const first = points[0]!.value
  const last = points[points.length - 1]!.value
  const percentChange = first > 0 ? ((last - first) / first) * 100 : null
  return { points, lastValue: last, percentChange }
}
