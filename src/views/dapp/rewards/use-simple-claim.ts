import { useDaoRewardTypeTotals } from '~/hooks/use-api-data'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { hasTypeTotalClaimable, typeTotalAmount } from '~/shared/lib/dao-reward-type-totals'
import { formatDecimal } from '~/shared/presenters/format'
import { toastClaimResult } from '~/views/dapp/rewards/toast-claim-result'
import { useDirectReferralClaim, useMarketFundClaim } from '~/views/dapp/rewards/use-claim-reward'

const TOKEN_AGX = 'AGX'

/** 简单领取：发展津贴与邀请奖，都是 AGX 直达钱包。 */
export type SimpleClaimView = 'grant' | 'invite'

/**
 * 简单领取视图模型。
 *
 * 津贴看 MARKET_FUND，邀请奖看 DIRECT_REFERRAL；签名领取都进市场基金库。
 */
export function useSimpleClaim(view: SimpleClaimView, sessionReady: boolean) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards[view]
  const grantClaim = useMarketFundClaim()
  const inviteClaim = useDirectReferralClaim()
  const claim = view === 'invite' ? inviteClaim : grantClaim
  const copy = view === 'invite' ? t.rewards.invite : t.rewards.grant
  const field = view === 'invite' ? 'DIRECT_REFERRAL' : 'MARKET_FUND'

  const { data: typeTotals } = useDaoRewardTypeTotals(sessionReady)
  const preview = typeTotalAmount(typeTotals, field)
  const hasClaimable = hasTypeTotalClaimable(preview)
  const claimableText = formatDecimal(preview, { digits: 4 })
  const ctaAmount = formatDecimal(preview, { digits: 4, suffix: ` ${TOKEN_AGX}` })
  const ctaLabel = interpolate(copy.ctaToWallet, { amount: ctaAmount })
  const canSubmit = sessionReady && !claim.isClaiming && claim.canClaim && hasClaimable

  function onClaim() {
    void claim.claim().then((result) => {
      toastClaimResult(result, {
        claimSuccess: t.rewards.claimSuccess,
      })
    })
  }

  return {
    card,
    copy,
    claimableText,
    ctaLabel,
    canSubmit,
    onClaim,
    isClaiming: claim.isClaiming,
    tokenGagx: TOKEN_AGX,
    tokenIcon: dappAssets.tokenAgx,
    claimIntoWallet: copy.claimIntoWallet,
    showTokenChip: true,
  }
}
