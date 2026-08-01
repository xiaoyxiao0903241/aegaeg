import { useI18n } from '~/i18n/use-i18n'

/**
 * `{label}: {value}` string for AmountBox / DappCountValue.
 * Empty / disconnected / preview → formatted zero; refetch keeps prior via keepPreviousData.
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
  const amount = !sessionReady || !walletReady || value.trim() === '' ? '0.00' : value
  return `${label}: ${amount}`
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
