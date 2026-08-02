/**
 * 资产仓位「剩余时间」倒计时（稿：`167 天 08:27:15` / `<1天` → `23:59:59`）。
 * `expiryUnixSec` 为链上 unix 秒；过期 → `00:00:00`（诚实空，非演示钟）。
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
