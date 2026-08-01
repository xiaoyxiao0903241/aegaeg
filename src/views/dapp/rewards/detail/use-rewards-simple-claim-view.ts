import { useI18n } from '~/i18n/use-i18n'
import { useMarketFundClaim } from '~/views/dapp/rewards/use-claim-reward'
import { REWARDS_DASH } from '~/views/dapp/rewards/rewards-display'
import { toastClaimResult } from '~/views/dapp/rewards/toast-claim-result'

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
      toastClaimResult(result, {
        claimSuccess: t.rewards.claimSuccess,
        confirmSyncFailed: t.rewards.claimErrors.confirmSyncFailed,
      })
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
