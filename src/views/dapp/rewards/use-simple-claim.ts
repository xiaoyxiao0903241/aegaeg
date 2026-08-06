import { useMarketAllowanceSummary, useParticipationAwardLogs } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApiAmount } from '~/views/dapp/rewards/shared'
import { toastClaimResult } from '~/views/dapp/rewards/toast-claim-result'
import { useIncentiveClaim, useMarketFundClaim } from '~/views/dapp/rewards/use-claim-reward'

const TOKEN_GAGX = 'gAGX'

/**
 * 参与奖没有 unlocked_claimable 字段，
 * 用发放记录中可领取状态（READY / PARTIALLY_CLAIMED）作为「有可领额」的信号。
 */
const PARTICIPATE_CLAIMABLE_STATUSES = new Set(['READY', 'PARTIALLY_CLAIMED'])

/** 简单领取仅发展津贴 / 参与奖；推荐奖走 Dao Mixed（REFERRAL_REWARD）。 */
export type SimpleClaimView = 'grant' | 'participate'

/**
 * 简单领取视图模型（发展津贴 / 参与奖）
 *
 * 两种类型分别走市场基金、激励池的领取签名；
 * 汇总各可领金额并决定提交按钮可用性。
 */
export function useSimpleClaim(view: SimpleClaimView, sessionReady: boolean) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards[view]
  const marketClaim = useMarketFundClaim()
  const incentiveClaim = useIncentiveClaim()
  const claim = view === 'grant' ? marketClaim : incentiveClaim

  const grant = t.rewards.grant
  const participate = t.rewards.participateClaim
  const copy = view === 'grant' ? grant : participate

  const summaryQuery = useMarketAllowanceSummary(sessionReady && view === 'grant')
  const summary = summaryQuery.data
  const grantAmountReady = sessionReady && !(summaryQuery.isLoading && summary == null)

  // 参与奖：API 无预览可领额；READY / PARTIALLY_CLAIMED 即「有可领」信号，防空跑签名。
  const participateLogsQuery = useParticipationAwardLogs(
    { page: 1, page_size: 50 },
    sessionReady && view === 'participate',
  )
  const participateItems = participateLogsQuery.data?.items ?? []
  const participateLogsReady =
    sessionReady && !(participateLogsQuery.isLoading && participateLogsQuery.data == null)
  const hasParticipateClaimable =
    view !== 'participate' ||
    (participateLogsReady &&
      participateItems.some((item) => PARTICIPATE_CLAIMABLE_STATUSES.has(item.status)))
  const participateReadyGross = participateItems.reduce((sum, item) => {
    if (item.status !== 'READY') return sum
    const n = Number(item.awarded_gross)
    return Number.isFinite(n) ? sum + n : sum
  }, 0)
  const participateAmountText =
    participateReadyGross > 0 ? formatApiAmount(String(participateReadyGross), { digits: 4 }) : null

  const pendingAmount = formatApiAmount(
    view === 'grant' && grantAmountReady ? summary?.unlockable_allowance : null,
    { digits: 4 },
  )
  const grantClaimableText = formatApiAmount(
    view === 'grant' && grantAmountReady ? summary?.unlocked_claimable : null,
    { digits: 4 },
  )
  const grantClaimableNum =
    view === 'grant' && grantAmountReady ? Number(summary?.unlocked_claimable) : NaN
  const hasGrantClaimable = Number.isFinite(grantClaimableNum) && grantClaimableNum > 0

  const claimableText =
    view === 'grant'
      ? grantClaimableText
      : (participateAmountText ?? t.rewards.detail.signedAmountHint)

  const ctaAmount =
    view === 'grant'
      ? `${grantClaimableText} ${TOKEN_GAGX}`
      : participateAmountText != null
        ? `${participateAmountText} ${TOKEN_GAGX}`
        : `— ${TOKEN_GAGX}`

  const ctaLabel = copy.ctaToWallet.replace('{amount}', ctaAmount)
  const canSubmit =
    sessionReady &&
    hasParticipateClaimable &&
    !(view === 'participate' && participateLogsQuery.isLoading) &&
    !claim.isClaiming &&
    claim.canClaim &&
    (view !== 'grant' || hasGrantClaimable)

  function onClaim() {
    void claim.claim().then((result) => {
      toastClaimResult(result, {
        claimSuccess: t.rewards.claimSuccess,
        confirmSyncFailed: t.rewards.claimErrors.confirmSyncFailed,
      })
    })
  }

  return {
    view,
    tokenGagx: TOKEN_GAGX,
    card,
    grant,
    participate,
    copy,
    pendingAmount,
    claimableText,
    claimIntoWallet: copy.claimIntoWallet,
    ctaLabel,
    canSubmit,
    isClaiming: claim.isClaiming,
    showTokenChip: true,
    showEmptyReferral: false,
    showEmptyParticipate:
      view === 'participate' && sessionReady && participateLogsReady && !hasParticipateClaimable,
    onClaim,
  }
}
