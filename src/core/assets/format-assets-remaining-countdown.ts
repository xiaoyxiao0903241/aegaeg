/**
 * 资产仓位「剩余时间」倒计时文本。
 *
 * 大于一天显示 `天数 时:分:秒`（如 `167 天 08:27:15`），不足一天仅显示
 * `时:分:秒`；已过期或时间差非有限数时返回 `00:00:00`，不做虚假跳动。
 *
 * @param expiryUnixSec 链上到期时间（unix 秒）
 * @param nowSec 当前时间（unix 秒）
 * @param dayUnit 「天」单位文案
 * @returns 倒计时文本
 * @see 手册 §13.3 展示字段
 */
export function formatAssetsRemainingCountdown(
  expiryUnixSec: bigint,
  nowSec: number,
  dayUnit: string,
): string {
  const left = Math.max(0, Number(expiryUnixSec) - nowSec)
  if (!Number.isFinite(left)) return '00:00:00'
  const days = Math.floor(left / 86_400)
  const hours = Math.floor((left % 86_400) / 3600)
  const minutes = Math.floor((left % 3600) / 60)
  const seconds = left % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  const hms = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  if (days > 0) return `${days} ${dayUnit} ${hms}`
  return hms
}
