import { formatNumber } from '~/shared/presenters/format'

/**
 * 拼接 `标签: 值` 余额文案（供 AmountBox / CountValue 使用）
 *
 * 未连接或余额未知时用零占位，保留 `余额: 0.0000` 固定显示形态，禁止回空串。
 */
export function formatExchangeBalanceLabel({
  label,
  value,
  sessionReady,
  walletReady,
  digits = 4,
}: {
  label: string
  value: string
  sessionReady: boolean
  walletReady: boolean
  digits?: number
}): string {
  const safeDigits = Math.max(0, Math.floor(digits))
  if (!sessionReady || !walletReady || value.trim() === '') {
    return `${label}: ${formatNumber(0, { digits: safeDigits })}`
  }
  return `${label}: ${value}`
}
