import { useEffect, useEffectEvent } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { useDappShell } from '~/app/dapp-shell-context'
import { toast } from 'sonner'
import { ACCOUNT_BANNED_SENTINEL, resolveAuthLoginErrorMessage } from '~/shared/api/account-banned'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank'
import { RewardsBalanceSection } from '~/views/dapp/rewards/rewards-balance-section'
import { RewardsRankSection } from '~/views/dapp/rewards/rewards-rank-section'

export function RewardsWidget() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { loginError } = useShareholderRankLabels(t)

  const presentLoginError = useEffectEvent((error: string) => {
    const message = resolveAuthLoginErrorMessage(error, {
      accountBanned: t.wallet.accountBanned,
      walletNotConnected: t.errors.walletNotConnected,
      loginFailed: t.errors.loginFailed,
      loginSignatureRejected: t.errors.loginSignatureRejected,
    })
    if (message) toast.error(message, { id: `rewards-login:${error}` })
  })

  useEffect(() => {
    if (!sessionReady || !loginError || loginError === ACCOUNT_BANNED_SENTINEL) return
    presentLoginError(loginError)
  }, [sessionReady, loginError])

  return (
    <DappWidgetFrame subtitle={t.rewards.intro} title={t.rewards.title}>
      <RewardsRankSection />
      <RewardsBalanceSection />
      {!sessionReady ? <DappWidgetConnectPromo /> : null}
    </DappWidgetFrame>
  )
}
