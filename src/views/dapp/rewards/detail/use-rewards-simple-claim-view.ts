import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useMarketFundClaim } from '~/views/dapp/rewards/use-claim-reward'
import { REWARDS_DASH } from '~/views/dapp/rewards/rewards-display'

const TOKEN_GAGX = 'gAGX'

export type SimpleClaimView = 'grant'

export function useRewardsSimpleClaimView(_view: SimpleClaimView, sessionReady: boolean) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards.grant
  const claim = useMarketFundClaim()
  const grant = t.rewards.grant

  const claimableText = !sessionReady
    ? t.rewards.hub.signInForBalance
    : t.rewards.detail.signedAmountHint
  const ctaAmount = !sessionReady ? REWARDS_DASH : `${REWARDS_DASH} ${TOKEN_GAGX}`
  const ctaLabel = grant.ctaToWallet.replace('{amount}', ctaAmount)
  const canSubmit = sessionReady && !claim.isClaiming && claim.canClaim

  function onClaim() {
    void claim.claim().then((result) => {
      if (!result) return
      if (result.status === 'confirm_failed') {
        toast.warning(t.rewards.claimErrors.confirmSyncFailed ?? t.rewards.claimSuccess)
        return
      }
      toast.success(t.rewards.claimSuccess)
    })
  }

  return {
    tokenGagx: TOKEN_GAGX,
    card,
    grant,
    copy: grant,
    claimableText,
    ctaLabel,
    canSubmit,
    isClaiming: claim.isClaiming,
    onClaim,
  }
}
