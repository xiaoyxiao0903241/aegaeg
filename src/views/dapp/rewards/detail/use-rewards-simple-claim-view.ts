import {
  useCommunityFundTotal,
  useMarketAllowanceSummary,
  useParticipationAwardLogs,
} from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { formatApiDecimalAmount } from '~/views/dapp/rewards/rewards-display'
import { toastClaimResult } from '~/views/dapp/rewards/toast-claim-result'
import {
  useCommunityFundClaim,
  useIncentiveClaim,
  useMarketFundClaim,
} from '~/views/dapp/rewards/use-claim-reward'

const TOKEN_GAGX = 'gAGX'

/**
 * 参与奖没有 unlocked_claimable 字段，
 * 用发放记录中可领取状态（READY / PARTIALLY_CLAIMED）作为「有可领额」的信号。
 */
const PARTICIPATE_CLAIMABLE_STATUSES = new Set(['READY', 'PARTIALLY_CLAIMED'])

export type SimpleClaimView = 'grant' | 'participate' | 'referral'

/**
 * 简单领取视图模型（发展津贴 / 参与奖 / 推荐奖）
 *
 * 三种类型分别走市场基金、激励池、社区基金的领取签名；
 * 汇总各可领金额并决定提交按钮可用性。
 */
export function useRewardsSimpleClaimView(view: SimpleClaimView, sessionReady: boolean) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards[view]
  const marketClaim = useMarketFundClaim()
  const incentiveClaim = useIncentiveClaim()
  const communityClaim = useCommunityFundClaim()
  const claim =
    view === 'grant' ? marketClaim : view === 'participate' ? incentiveClaim : communityClaim

  const grant = t.rewards.grant
  const participate = t.rewards.participateClaim
  const referral = t.rewards.referralClaim
  const copy = view === 'grant' ? grant : view === 'participate' ? participate : referral

  const summaryQuery = useMarketAllowanceSummary(sessionReady && view === 'grant')
  const summary = summaryQuery.data
  const grantAmountReady = sessionReady && !(summaryQuery.isLoading && summary == null)

  const { data: communityFundTotal, isLoading: communityLoading } = useCommunityFundTotal(
    sessionReady && view === 'referral',
  )
  const referralAmountRaw = communityFundTotal?.unlocked_claimable
  const referralAmount = referralAmountRaw != null ? Number(referralAmountRaw) : Number.NaN
  const referralAmountOk =
    view !== 'referral' || (Number.isFinite(referralAmount) && referralAmount > 0)

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
    participateReadyGross > 0
      ? formatApiDecimalAmount(String(participateReadyGross), { digits: 4 })
      : null

  const pendingAmount = formatApiDecimalAmount(
    view === 'grant' && grantAmountReady ? summary?.unlockable_allowance : null,
    { digits: 4 },
  )
  const grantClaimableText = formatApiDecimalAmount(
    view === 'grant' && grantAmountReady ? summary?.unlocked_claimable : null,
    { digits: 4 },
  )
  const grantClaimableNum =
    view === 'grant' && grantAmountReady ? Number(summary?.unlocked_claimable) : NaN
  const hasGrantClaimable = Number.isFinite(grantClaimableNum) && grantClaimableNum > 0

  const claimableText =
    view === 'grant'
      ? grantClaimableText
      : view === 'referral'
        ? !sessionReady
          ? formatGroupedNumber(0, { digits: 2, prefix: '$' })
          : communityLoading && referralAmountRaw == null
            ? formatGroupedNumber(0, { digits: 2, prefix: '$' })
            : formatGroupedNumber(Number.isFinite(referralAmount) ? referralAmount : 0, {
                digits: 2,
                prefix: '$',
              })
        : (participateAmountText ?? t.rewards.detail.signedAmountHint)

  const ctaAmount =
    view === 'grant'
      ? `${grantClaimableText} ${TOKEN_GAGX}`
      : view === 'referral'
        ? !sessionReady
          ? formatGroupedNumber(0, { digits: 2, prefix: '$' })
          : communityLoading && referralAmountRaw == null
            ? formatGroupedNumber(0, { digits: 2, prefix: '$' })
            : formatGroupedNumber(Number.isFinite(referralAmount) ? referralAmount : 0, {
                digits: 2,
                prefix: '$',
              })
        : participateAmountText != null
          ? `${participateAmountText} ${TOKEN_GAGX}`
          : `— ${TOKEN_GAGX}`

  const ctaLabel = copy.ctaToWallet.replace('{amount}', ctaAmount)
  const canSubmit =
    sessionReady &&
    referralAmountOk &&
    hasParticipateClaimable &&
    !(view === 'referral' && communityLoading) &&
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
    referral,
    copy,
    pendingAmount,
    claimableText,
    claimIntoWallet: copy.claimIntoWallet,
    ctaLabel,
    canSubmit,
    isClaiming: claim.isClaiming,
    showTokenChip: view !== 'referral',
    showEmptyReferral: view === 'referral' && sessionReady && !referralAmountOk,
    showEmptyParticipate:
      view === 'participate' && sessionReady && participateLogsReady && !hasParticipateClaimable,
    onClaim,
  }
}
