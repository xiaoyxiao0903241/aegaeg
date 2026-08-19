/**
 * 面积图底部轴 / tip 日期文案。
 *
 * 粒度只看返回点的首末跨度：约 ≤62 天为日（轴 `MM-DD`），更长为月（`YYYY-MM`）。
 * 不跟 Segment 的 week/year/all 绑定——年/全部若只有几周数据，仍按短窗标日。
 */

const DAY_S = 86_400
/** 短窗上限：略大于 60 天，避免整月贴边误判为月粒度。 */
export const CHART_SHORT_SPAN_MAX_S = 62 * DAY_S

export type ChartAxisTimePoint = {
  time: number
}

/** 轴 / tip 日期粒度：日 → `MM-DD` / `YYYY-MM-DD`；月 → `YYYY-MM`。 */
export type ChartDateGrain = 'day' | 'month'

/** UTC 秒 → `YYYY-MM` */
export function formatChartYearMonth(timeSec: number): string {
  const d = new Date(timeSec * 1000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/** UTC 秒 → `MM-DD` */
export function formatChartMonthDay(timeSec: number): string {
  const d = new Date(timeSec * 1000)
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${m}-${day}`
}

/** UTC 秒 → `YYYY-MM-DD` */
export function formatChartYearMonthDay(timeSec: number): string {
  const d = new Date(timeSec * 1000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 首末点时间跨度（秒）；不足两点为 0。
 *
 * @param points 已按时间升序的点列
 */
export function chartPointsSpanSeconds(points: readonly ChartAxisTimePoint[]): number {
  if (points.length < 2) return 0
  const first = points[0]!.time
  const last = points[points.length - 1]!.time
  return Math.max(0, last - first)
}

/** 短跨度 → day，否则 month。 */
export function chartDateGrainFromSpan(spanSeconds: number): ChartDateGrain {
  return spanSeconds <= CHART_SHORT_SPAN_MAX_S ? 'day' : 'month'
}

/**
 * 轴标签：日粒度 `MM-DD`，月粒度 `YYYY-MM`。
 *
 * @param timeSec UTC 秒
 * @param grain 日期粒度
 */
export function formatChartAxisDate(timeSec: number, grain: ChartDateGrain): string {
  return grain === 'day' ? formatChartMonthDay(timeSec) : formatChartYearMonth(timeSec)
}

/**
 * tip 日期：日粒度给到日，月粒度到月。
 *
 * @param timeSec UTC 秒
 * @param grain 日期粒度
 */
export function formatChartTipDate(timeSec: number, grain: ChartDateGrain): string {
  return grain === 'day' ? formatChartYearMonthDay(timeSec) : formatChartYearMonth(timeSec)
}

/**
 * 按点数抽轴标：点少全展示，点多最多 `maxLabels` 个且保证首尾。
 * 文案格式由序列跨度决定。
 *
 * @param points 图表点
 * @param maxLabels 标签上限
 */
export function pickChartAxisLabels(
  points: readonly ChartAxisTimePoint[],
  maxLabels = 6,
): readonly string[] {
  if (points.length === 0) return []
  const grain = chartDateGrainFromSpan(chartPointsSpanSeconds(points))
  if (points.length <= maxLabels) {
    return points.map((p) => formatChartAxisDate(p.time, grain))
  }
  const last = maxLabels - 1
  const labels: string[] = []
  for (let i = 0; i < maxLabels; i += 1) {
    const idx = Math.round((i / last) * (points.length - 1))
    labels.push(formatChartAxisDate(points[idx]!.time, grain))
  }
  return labels
}
