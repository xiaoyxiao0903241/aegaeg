const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/

/**
 * 开奖结果下拉：接口 `dates`；若当前选中日不在列表里则补上，避免空选。
 *
 * @param dates `/lucky-reward/winners` 的 dates
 * @param fallbackDate 当前应选中的日期
 */
export function luckyWinnersDateList(
  dates: readonly string[] | null | undefined,
  fallbackDate?: string | null,
): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of dates ?? []) {
    const day = raw.trim()
    if (!ISO_DAY.test(day) || seen.has(day)) continue
    seen.add(day)
    out.push(day)
  }
  const fallback = fallbackDate?.trim() ?? ''
  if (ISO_DAY.test(fallback) && !seen.has(fallback)) {
    out.unshift(fallback)
  }
  return out
}

/**
 * 下拉选中值：用户点过用用户选的；否则用默认请求返回的 `date`（最新已开奖日）。
 *
 * 不把「今天」当默认——当天凌晨前尚未开奖。
 */
export function luckyWinnersSelectedDate(
  selectedDate: string | null | undefined,
  responseDate: string | null | undefined,
): string {
  const selected = selectedDate?.trim() ?? ''
  if (selected) return selected
  return responseDate?.trim() ?? ''
}
