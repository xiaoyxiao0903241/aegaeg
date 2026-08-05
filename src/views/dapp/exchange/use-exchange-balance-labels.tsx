import { useI18n } from '~/i18n/use-i18n'

/**
 * 拼接 `标签: 值` 余额文案（供 AmountBox / CountValue 使用）
 *
 * 未连接或预览态返回 `0.00`；已连接且值为空返回 `''`，
 * 由 CountValue 保留占位。
 */
export function formatExchangeBalanceLabel({
  label,
  value,
  sessionReady,
  walletReady,
}: {
  label: string
  value: string
  sessionReady: boolean
  walletReady: boolean
}): string {
  if (!sessionReady || !walletReady) return `${label}: 0.00`
  if (value.trim() === '') return ''
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
