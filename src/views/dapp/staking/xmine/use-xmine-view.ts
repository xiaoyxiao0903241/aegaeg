import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatAmountBalanceLabel } from '~/core/wallet/write-cta'
import { useI18n } from '~/i18n/use-i18n'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useXmineWidget } from '~/views/dapp/staking/xmine/use-xmine-widget'

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
    balance: !sessionReady || !walletReady ? '0.00' : xmine.balanceLabel,
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
