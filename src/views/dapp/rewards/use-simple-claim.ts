import { useDaoRewardTypeTotals } from '~/hooks/use-api-data'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { hasTypeTotalClaimable, typeTotalAmount } from '~/shared/lib/dao-reward-type-totals'
import { formatDecimal } from '~/shared/presenters/format'
import { toastClaimResult } from '~/views/dapp/rewards/toast-claim-result'
import { useMarketFundClaim } from '~/views/dapp/rewards/use-claim-reward'

const TOKEN_AGX = 'AGX'

/** 简单领取仅发展津贴；参与 / 推荐等走 Dao Mixed。 */
export type SimpleClaimView = 'grant'

/**
 * 简单领取视图模型（发展津贴）
 *
 * 走市场基金签名领取；可领金额只看 MARKET_FUND 类型合计。
 */
export function useSimpleClaim(view: SimpleClaimView, sessionReady: boolean) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards[view]
  const claim = useMarketFundClaim()
  const grant = t.rewards.grant
  const copy = grant

  const { data: typeTotals } = useDaoRewardTypeTotals(sessionReady && view === 'grant')
  const grantPreview = view === 'grant' ? typeTotalAmount(typeTotals, 'MARKET_FUND') : null
  const hasGrantClaimable = hasTypeTotalClaimable(grantPreview)

  const grantClaimableText = formatDecimal(grantPreview, { digits: 4 })
  const claimableText = grantClaimableText
  const ctaAmount = formatDecimal(grantPreview, { digits: 4, suffix: ` ${TOKEN_AGX}` })
  const ctaLabel = interpolate(copy.ctaToWallet, { amount: ctaAmount })
  const canSubmit = sessionReady && !claim.isClaiming && claim.canClaim && hasGrantClaimable

  function onClaim() {
    void claim.claim().then((result) => {
      toastClaimResult(result, {
        claimSuccess: t.rewards.claimSuccess,
      })
    })
  }

  return {
    card,
    grant,
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
