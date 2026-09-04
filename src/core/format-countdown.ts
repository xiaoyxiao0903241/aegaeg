export type CountdownPartId = 'days' | 'hours' | 'minutes' | 'seconds'

export type CountdownPart = {
  id: CountdownPartId
  text: string
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function safeSec(totalSec: number): number {
  const n = Math.floor(totalSec)
  if (!Number.isFinite(n) || n <= 0) return 0
  return n
}

/**
 * 剩余秒 → 倒计时各段数字。
 *
 * 不含秒时精确到分钟：丢掉不足一分的零头；整段还剩不到 1 分钟仍显示 1 分钟，
 * 避免界面看起来已经到期。这是全站剩余时间展示的唯一分段规则。
 *
 * @param totalSec 剩余墙钟秒
 * @param units 格式阶梯（大→小）；含 `days` 时「时」为日内，否则为总小时
 * @param trim 是否从最大非 0 单位起裁掉左侧高位 0
 * @returns 与 `units`（或 trim 后后缀）同序的数字段
 */
export function formatCountdownParts(
  totalSec: number,
  units: readonly CountdownPartId[] = ['hours', 'minutes'],
  trim = true,
): CountdownPart[] {
  let sec = safeSec(totalSec)
  if (!units.includes('seconds') && sec > 0 && sec < 60) sec = 60
  const hasDays = units.includes('days')
  const days = Math.floor(sec / 86_400)
  const hours = hasDays ? Math.floor((sec % 86_400) / 3600) : Math.floor(sec / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = sec % 60

  const byId: Record<CountdownPartId, { value: number; text: string }> = {
    days: { value: days, text: String(days) },
    hours: { value: hours, text: pad2(hours) },
    minutes: { value: minutes, text: pad2(minutes) },
    seconds: { value: seconds, text: pad2(seconds) },
  }

  const ordered = units.map((id) => ({ id, ...byId[id] }))

  if (!trim) {
    return ordered.map(({ id, text }) => ({ id, text }))
  }

  let start = ordered.findIndex((part) => part.value > 0)
  if (start < 0) start = ordered.length - 1
  return ordered.slice(start).map(({ id, text }) => ({ id, text }))
}

/**
 * 结束时刻 → `HH:MM` 倒计时。缺结束时刻或非正 → `null`（界面走 `--`）。
 *
 * @param endTimeSec unix 秒
 * @param nowSec 当前墙钟 unix 秒
 */
export function formatCountdownClock(
  endTimeSec: bigint | number | null | undefined,
  nowSec: number,
): string | null {
  if (endTimeSec == null) return null
  const end = Number(endTimeSec)
  if (!Number.isFinite(end) || end <= 0) return null
  const [hours, minutes] = formatCountdownParts(
    Math.max(0, end - nowSec),
    ['hours', 'minutes'],
    false,
  )
  return `${hours?.text ?? '00'}:${minutes?.text ?? '00'}`
}
