import { ExchangeBalanceSkeleton } from '~/app/shell/dapp-skeleton'
import { useI18n } from '~/i18n/use-i18n'

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
  const exchangePreview = !sessionReady
  const showBalanceSkeleton = !exchangePreview && isBalancesLoading
  const zeroBalanceLabel = `${t.exchange.balance}: 0.00`

  const sellLabel = showBalanceSkeleton ? (
    <>
      {t.exchange.balance}: <ExchangeBalanceSkeleton />
    </>
  ) : exchangePreview ? (
    zeroBalanceLabel
  ) : (
    `${t.exchange.balance}: ${walletReady ? sellBalanceLabel : '—'}`
  )

  const buyLabel = showBalanceSkeleton ? (
    <>
      {t.exchange.balance}: <ExchangeBalanceSkeleton />
    </>
  ) : exchangePreview ? (
    zeroBalanceLabel
  ) : (
    `${t.exchange.balance}: ${walletReady ? buyBalanceLabel : '—'}`
  )

  return { buyLabel, sellLabel, exchangePreview }
}
