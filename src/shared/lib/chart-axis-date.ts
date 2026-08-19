/**
 * 面积图底部轴 / tip 日期文案。
 *
 * 若任一点的接口 `date` 是 `YYYY-MM`，整图按月（轴/tip `YYYY-MM`），避免当成日 1 号标成 `MM-01`。
 * 全是逐日 `YYYY-MM-DD` 时才看首末跨度：约 ≤6 个月为日（轴 `MM-DD`），更长为月。
 */

const DAY_S = 86_400
/** 短窗上限：略大于 6×31 天，避免满 6 个自然月的逐日窗被标成月。 */
export const CHART_SHORT_SPAN_MAX_S = 186 * DAY_S

const MONTH_DATE_RE = /^\d{4}-\d{2}$/

export type ChartAxisTimePoint = {
  time: number
  /** 接口原样 `date`；`YYYY-MM` 时强制月粒度 */
  date?: string
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
 * 有 `YYYY-MM` 点则整图按月；否则按首末跨度。
 *
 * @param points 已按时间升序的点列
 */
export function chartDateGrainFromPoints(points: readonly ChartAxisTimePoint[]): ChartDateGrain {
  for (const point of points) {
    if (point.date != null && MONTH_DATE_RE.test(point.date.trim())) return 'month'
  }
  return chartDateGrainFromSpan(chartPointsSpanSeconds(points))
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
 * 文案格式：有月点则 `YYYY-MM`，否则按跨度。
 *
 * @param points 图表点
 * @param maxLabels 标签上限
 */
export function pickChartAxisLabels(
  points: readonly ChartAxisTimePoint[],
  maxLabels = 6,
): readonly string[] {
  if (points.length === 0) return []
  const grain = chartDateGrainFromPoints(points)
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
