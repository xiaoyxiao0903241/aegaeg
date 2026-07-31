import { ExchangeBalanceSkeleton } from '~/app/shell/dapp-skeleton'
import { useI18n } from '~/i18n/use-i18n'

/**
 * `{label}: {value}` with skeleton while loading / `0.00` in preview / `—` when disconnected.
 * Shared by exchange balance rows across flash / trade / burn (S6).
 */
export function formatExchangeBalanceLabel({
  label,
  value,
  isBalancesLoading,
  sessionReady,
  walletReady,
}: {
  label: string
  value: string
  isBalancesLoading: boolean
  sessionReady: boolean
  walletReady: boolean
}) {
  const exchangePreview = !sessionReady
  const showBalanceSkeleton = !exchangePreview && isBalancesLoading

  if (showBalanceSkeleton) {
    return (
      <>
        {label}: <ExchangeBalanceSkeleton />
      </>
    )
  }
  if (exchangePreview) return `${label}: 0.00`
  return `${label}: ${walletReady ? value : '—'}`
}

export function useExchangeBalanceLabels({
  buyBalanceLabel,
  isBalancesLoading,
  sellBalanceLabel,
  sessionReady,
  walletReady,
}: {
  buyBalanceLabel: string
  isBalancesLoading: boolean
  sellBalanceLabel: string
  sessionReady: boolean
  walletReady: boolean
}) {
  const { messages: t } = useI18n()

  const sellLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: sellBalanceLabel,
    isBalancesLoading,
    sessionReady,
    walletReady,
  })
  const buyLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: buyBalanceLabel,
    isBalancesLoading,
    sessionReady,
    walletReady,
  })

  return { buyLabel, sellLabel, exchangePreview: !sessionReady }
}
