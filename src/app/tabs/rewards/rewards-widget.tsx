import { useEffect } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappWidgetConnectPromo } from '~/app/components/dapp-widget-connect-footer'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { useDappShell } from '~/app/dapp-shell-context'
import { toast } from 'sonner'
import { toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { RewardsBalanceSection } from '~/app/tabs/rewards/rewards-balance-section'
import { RewardsRankSection } from '~/app/tabs/rewards/rewards-rank-section'

export function RewardsWidget() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { loginError } = useShareholderRankLabels(t)

  useEffect(() => {
    if (!sessionReady || !loginError) return
    const message = toWalletUserFacingMessage(loginError)
    if (message) toast.error(message)
  }, [sessionReady, loginError])

  return (
    <DappWidgetFrame subtitle={t.rewards.intro} title={t.rewards.title}>
      <RewardsRankSection />
      <RewardsBalanceSection />
      {!sessionReady ? <DappWidgetConnectPromo /> : null}
    </DappWidgetFrame>
  )
}
