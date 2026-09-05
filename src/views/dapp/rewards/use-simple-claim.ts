import { useDaoRewardTypeTotals, useMarketAllowanceSummary } from '~/hooks/use-api-data'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { hasTypeTotalClaimable, typeTotalAmount } from '~/shared/lib/dao-reward-type-totals'
import { formatDecimal } from '~/shared/presenters/format'
import { formatApiAmount } from '~/views/dapp/rewards/shared'
import { toastClaimResult } from '~/views/dapp/rewards/toast-claim-result'
import { useMarketFundClaim } from '~/views/dapp/rewards/use-claim-reward'

const TOKEN_GAGX = 'gAGX'

/** 简单领取仅发展津贴；参与 / 推荐等走 Dao Mixed。 */
export type SimpleClaimView = 'grant'

/**
 * 简单领取视图模型（发展津贴）
 *
 * 走市场基金签名领取；汇总可领金额并决定提交按钮可用性。
 */
export function useSimpleClaim(view: SimpleClaimView, sessionReady: boolean) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards[view]
  const claim = useMarketFundClaim()
  const grant = t.rewards.grant
  const copy = grant

  const summaryQuery = useMarketAllowanceSummary(sessionReady && view === 'grant')
  const { data: typeTotals } = useDaoRewardTypeTotals(sessionReady && view === 'grant')
  const summary = summaryQuery.data
  const grantAmountReady = sessionReady && !(summaryQuery.isLoading && summary == null)
  const grantPreview = view === 'grant' ? typeTotalAmount(typeTotals, 'MARKET_FUND') : null
  const hasGrantClaimable = hasTypeTotalClaimable(grantPreview)

  const pendingAmount = formatApiAmount(
    view === 'grant' && grantAmountReady ? summary?.unlockable_allowance : null,
    { digits: 4 },
  )
  const grantClaimableText = formatDecimal(grantPreview, { digits: 4 })
  const claimableText = grantClaimableText
  const ctaAmount = formatDecimal(grantPreview, { digits: 4, suffix: ` ${TOKEN_GAGX}` })
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
    pendingAmount,
    ctaLabel,
    canSubmit,
    onClaim,
    isClaiming: claim.isClaiming,
    tokenGagx: TOKEN_GAGX,
    claimIntoWallet: copy.claimIntoWallet,
    showTokenChip: true,
    hasGrantClaimable,
  }
}
