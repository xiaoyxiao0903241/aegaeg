import { useI18n } from '~/i18n/use-i18n'

/**
 * `{label}: {value}` string for AmountBox / CountValue.
 * Disconnected / preview → `0.00`; connected + empty value → `''` (retain via CountValue).
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
