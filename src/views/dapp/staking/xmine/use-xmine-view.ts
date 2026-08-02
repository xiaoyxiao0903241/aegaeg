import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatAmountBalanceLabel } from '~/core/wallet/write-cta'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useXmineWidget } from '~/views/dapp/staking/xmine/use-xmine-widget'
import { useXmineOverviewQuery } from '~/web3/staking/use-staking-queries'
import { formatXmineDailyYieldLabel } from '~/web3/staking/xmine-overview-read'

const ZERO_PCT = `${formatGroupedNumber(0, { digits: 2 })}%`

export function useXmineView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const overviewQuery = useXmineOverviewQuery()
  const xmine = useXmineWidget(sessionReady, {
    onSuccess: () => {
      toast.success(t.staking.xmine.success)
    },
  })

  const amountLabel = formatAmountBalanceLabel(t.staking.xmine.amountBalance, {
    balance: !sessionReady || !walletReady ? '0.00' : xmine.balanceLabel,
  })

  const dailyYieldLabel =
    overviewQuery.data != null
      ? formatXmineDailyYieldLabel(overviewQuery.data.yieldRateBP)
      : ZERO_PCT

  return {
    t,
    xmine,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    dailyYieldLabel,
    onSubmit: () => xmine.submit(),
  }
}
