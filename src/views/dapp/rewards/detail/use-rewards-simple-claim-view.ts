import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { useCommunityFundTotal } from '~/hooks/use-api-data'
import {
  useCommunityFundClaim,
  useIncentiveClaim,
  useMarketFundClaim,
} from '~/views/dapp/rewards/use-claim-reward'
import { REWARDS_DASH, REWARDS_LOADING } from '~/views/dapp/rewards/rewards-display'

const TOKEN_GAGX = 'gAGX'

export type SimpleClaimView = 'grant' | 'participate' | 'referral'

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
  const { data: communityFundTotal, isLoading: communityLoading } =
    useCommunityFundTotal(sessionReady)

  const referralAmountRaw = communityFundTotal?.unlocked_claimable
  const referralAmount = referralAmountRaw != null ? Number(referralAmountRaw) : Number.NaN
  const referralAmountKnown = view === 'referral'
  const referralAmountOk =
    !referralAmountKnown || (Number.isFinite(referralAmount) && referralAmount > 0)
  /** Same CommunityFund as genesis 发展基金 (pre-leaf dual entry); amount gate only — node gate is backend/sign. */

  const claimableText = !sessionReady
    ? t.rewards.hub.signInForBalance
    : view === 'referral'
      ? communityLoading && referralAmountRaw == null
        ? REWARDS_LOADING
        : formatGroupedNumber(Number.isFinite(referralAmount) ? referralAmount : 0, {
            digits: 2,
            prefix: '$',
          })
      : t.rewards.detail.signedAmountHint
  const ctaAmount = !sessionReady
    ? REWARDS_DASH
    : view === 'referral'
      ? communityLoading && referralAmountRaw == null
        ? REWARDS_LOADING
        : formatGroupedNumber(Number.isFinite(referralAmount) ? referralAmount : 0, {
            digits: 2,
            prefix: '$',
          })
      : `${REWARDS_DASH} ${TOKEN_GAGX}`
  const ctaLabel = copy.ctaToWallet.replace('{amount}', ctaAmount)
  const showTokenChip = view !== 'referral'
  const canSubmit =
    sessionReady &&
    referralAmountOk &&
    !(view === 'referral' && communityLoading) &&
    !claim.isClaiming &&
    claim.canClaim

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
    participate,
    referral,
    copy,
    referralAmountOk,
    claimableText,
    ctaLabel,
    showTokenChip,
    canSubmit,
    isClaiming: claim.isClaiming,
    onClaim,
  }
}
