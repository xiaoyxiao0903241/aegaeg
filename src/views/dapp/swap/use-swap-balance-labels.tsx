import { SwapBalanceSkeleton } from '~/app/shell/dapp-skeleton'
import { useI18n } from '~/i18n/use-i18n'

export function useSwapBalanceLabels({
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
  const swapPreview = !sessionReady
  const showBalanceSkeleton = !swapPreview && isBalancesLoading
  const zeroBalanceLabel = `${t.swap.balance}: 0.00`

  const sellLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : swapPreview ? (
    zeroBalanceLabel
  ) : (
    `${t.swap.balance}: ${walletReady ? sellBalanceLabel : '—'}`
  )

  const buyLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : swapPreview ? (
    zeroBalanceLabel
  ) : (
    `${t.swap.balance}: ${walletReady ? buyBalanceLabel : '—'}`
  )

  return { buyLabel, sellLabel, swapPreview }
}
