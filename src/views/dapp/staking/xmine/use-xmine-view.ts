import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useXmineWidget } from '~/views/dapp/staking/xmine/use-xmine-widget'
import { formatAmountBalanceLabel } from '~/core/wallet/write-cta'

export function useXmineView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const xmine = useXmineWidget(sessionReady, {
    onSuccess: () => {
      toast.success(t.staking.xmine.success)
    },
  })

  const amountLabel = formatAmountBalanceLabel(t.staking.xmine.amountBalance, {
    loading: xmine.isBalancesLoading,
    balance: xmine.balanceLabel,
  })

  return {
    t,
    xmine,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    onSubmit: () => xmine.submit(),
  }
}
