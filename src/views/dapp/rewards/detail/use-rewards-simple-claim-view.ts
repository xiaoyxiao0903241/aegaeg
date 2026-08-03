import { useMarketAllowanceSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApiDecimalAmount } from '~/views/dapp/rewards/rewards-display'
import { toastClaimResult } from '~/views/dapp/rewards/toast-claim-result'
import { useMarketFundClaim } from '~/views/dapp/rewards/use-claim-reward'

const TOKEN_GAGX = 'gAGX'

export type SimpleClaimView = 'grant'

/** Figma 4410:221 左栏 — 待审批 / 可领取金额接 market-allowance/summary */
export function useRewardsSimpleClaimView(_view: SimpleClaimView, sessionReady: boolean) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards.grant
  const claim = useMarketFundClaim()
  const grant = t.rewards.grant
  const summaryQuery = useMarketAllowanceSummary(sessionReady)
  const summary = summaryQuery.data
  const amountReady = sessionReady && !(summaryQuery.isLoading && summary == null)

  /** 稿 24px 金额位：4 位小数；未登录 / 冷启动 → 0.0000（同 Hub） */
  const pendingAmount = formatApiDecimalAmount(amountReady ? summary?.unlockable_allowance : null, {
    digits: 4,
  })
  const claimableText = formatApiDecimalAmount(amountReady ? summary?.unlocked_claimable : null, {
    digits: 4,
  })
  const claimableNum = amountReady ? Number(summary?.unlocked_claimable) : NaN
  const hasClaimable = Number.isFinite(claimableNum) && claimableNum > 0

  const ctaAmount = `${claimableText} ${TOKEN_GAGX}`
  const ctaLabel = grant.ctaToWallet.replace('{amount}', ctaAmount)
  const canSubmit = sessionReady && !claim.isClaiming && claim.canClaim && hasClaimable

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
    pendingAmount,
    claimableText,
    ctaLabel,
    canSubmit,
    isClaiming: claim.isClaiming,
    onClaim,
  }
}
