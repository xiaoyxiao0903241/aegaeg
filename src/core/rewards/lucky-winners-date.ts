const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * 开奖结果可选日期：只用接口 `dates`，不去发明未开奖日。
 *
 * @param dates `/lucky-reward/winners` 的 dates
 * @returns 去重后的 yyyy-MM-dd 列表（保持接口顺序）
 * @see docs/backend-api/api.md #lucky-reward/winners
 */
export function luckyWinnersDateList(dates: readonly string[] | null | undefined): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of dates ?? []) {
    const date = parseIsoDay(raw)
    if (!date) continue
    const day = formatIsoDay(date)
    if (seen.has(day)) continue
    seen.add(day)
    out.push(day)
  }
  return out
}

/**
 * 选中值：用户点过用用户选的；否则用默认请求返回的 `date`（最新已开奖日）。
 *
 * 不把「今天」当默认——当天凌晨前尚未开奖。
 *
 * @param selectedDate 会话里用户选中的日期
 * @param responseDate 接口返回的当前名单日
 * @see docs/backend-api/api.md #lucky-reward/winners
 */
export function luckyWinnersSelectedDate(
  selectedDate: string | null | undefined,
  responseDate: string | null | undefined,
): string {
  const selected = selectedDate?.trim() ?? ''
  if (selected) return selected
  return responseDate?.trim() ?? ''
}

/**
 * 把 yyyy-MM-dd 解析成本地日历日（零点）。非法或日历上不存在的日期返回 undefined。
 *
 * @param iso 接口日期字符串
 */
export function parseIsoDay(iso: string | null | undefined): Date | undefined {
  const match = ISO_DAY.exec(iso?.trim() ?? '')
  if (!match) return undefined
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }
  return date
}

/**
 * 把本地 Date 格式化成 yyyy-MM-dd，供接口 `date` 使用。
 *
 * @param date 本地日历日
 */
export function formatIsoDay(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 日历某日是否在后端已开奖日期集合里。
 *
 * @param date 日历格对应的本地日
 * @param allowed `luckyWinnersDateList` 得到的日期集合
 */
export function isLuckyWinnersDateAllowed(date: Date, allowed: ReadonlySet<string>): boolean {
  return allowed.has(formatIsoDay(date))
}

/**
 * 日历可翻月份：最早 / 最晚已开奖日所在月的 1 号。
 *
 * @param dates 已开奖日期
 * @returns 无合法日期时起止都为 undefined
 */
export function luckyWinnersCalendarBounds(dates: readonly string[]): {
  startMonth: Date | undefined
  endMonth: Date | undefined
} {
  let min: Date | undefined
  let max: Date | undefined
  for (const raw of dates) {
    const date = parseIsoDay(raw)
    if (!date) continue
    if (!min || date < min) min = date
    if (!max || date > max) max = date
  }
  if (!min || !max) return { startMonth: undefined, endMonth: undefined }
  return {
    startMonth: new Date(min.getFullYear(), min.getMonth(), 1),
    endMonth: new Date(max.getFullYear(), max.getMonth(), 1),
  }
}
