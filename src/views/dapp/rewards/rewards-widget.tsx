import { useEffect } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappWidgetConnectPromo } from '~/app/components/dapp-widget-connect-footer'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { useDappShell } from '~/app/dapp-shell-context'
import { toast } from 'sonner'
import { ACCOUNT_BANNED_SENTINEL, resolveAuthLoginErrorMessage } from '~/lib/api/account-banned'
import { toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { RewardsBalanceSection } from '~/views/dapp/rewards/rewards-balance-section'
import { RewardsRankSection } from '~/views/dapp/rewards/rewards-rank-section'

export function RewardsWidget() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { loginError } = useShareholderRankLabels(t)

  useEffect(() => {
    if (!sessionReady || !loginError || loginError === ACCOUNT_BANNED_SENTINEL) return
    const message =
      resolveAuthLoginErrorMessage(loginError, t.wallet.accountBanned) ??
      toWalletUserFacingMessage(loginError)
    if (message) toast.error(message)
  }, [sessionReady, loginError, t.wallet.accountBanned])

  return (
    <DappWidgetFrame subtitle={t.rewards.intro} title={t.rewards.title}>
      <RewardsRankSection />
      <RewardsBalanceSection />
      {!sessionReady ? <DappWidgetConnectPromo /> : null}
    </DappWidgetFrame>
  )
}
