import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'

/**
 * 拼接 `标签: 值` 余额文案（供 AmountBox / CountValue 使用）
 *
 * 未连接或余额未知时用零占位，保留 `余额: 0.0000` chrome，禁止回空串。
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
    return `${label}: ${formatGroupedNumber(0, { digits: safeDigits })}`
  }
  return `${label}: ${value}`
}

export function useExchangeBalanceLabels({
  buyBalanceLabel,
  sellBalanceLabel,
  sessionReady,
  walletReady,
}: {
  buyBalanceLabel: string
  sellBalanceLabel: string
  sessionReady: boolean
  walletReady: boolean
}) {
  const { messages: t } = useI18n()

  const sellLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: sellBalanceLabel,
    sessionReady,
    walletReady,
  })
  const buyLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: buyBalanceLabel,
    sessionReady,
    walletReady,
  })

  return { buyLabel, sellLabel, exchangePreview: !sessionReady }
}
