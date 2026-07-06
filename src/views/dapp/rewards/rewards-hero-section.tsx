import { useI18n } from '~/i18n/use-i18n'
import { RewardsHeroBodySkeleton } from '~/app/shell/components/dapp-skeleton'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { useDappShell } from '~/app/dapp-shell-context'
import { useCommunityFundTotal } from '~/hooks/use-api-data'
import { formatShareholderHintForRank } from '~/shared/api/format-display'
import { buildRewardTierRows } from '~/core/presale/tier-table'
import {
  RewardsHeroBodyCopy,
  RewardsHeroCard,
  RewardsHeroTitle,
} from '~/views/dapp/rewards/rewards-hero-card'

function RewardsHeroBody({
  hasRank,
  heroTierRewardBody,
  isSuperCommunity,
  superCommunityBenefitBody,
}: {
  hasRank: boolean
  heroTierRewardBody: string
  isSuperCommunity: boolean
  superCommunityBenefitBody: string
}) {
  return (
    <RewardsHeroBodyCopy>
      <p className="m-0">{heroTierRewardBody}</p>
      {hasRank && isSuperCommunity ? <p className="m-0">{superCommunityBenefitBody}</p> : null}
    </RewardsHeroBodyCopy>
  )
}

function RewardsHeroPanel({
  compactSkeleton,
  hasRank,
  heroTierRewardBody,
  heroTitle,
  isSuperCommunity,
  kicker,
  layout,
  showHeroSkeleton,
  superCommunityBadge,
  superCommunityBenefitBody,
}: {
  compactSkeleton: boolean
  hasRank: boolean
  heroTierRewardBody: string
  heroTitle: string
  isSuperCommunity: boolean
  kicker: string
  layout: 'desktop' | 'mobile'
  showHeroSkeleton: boolean
  superCommunityBadge: string
  superCommunityBenefitBody: string
}) {
  return (
    <RewardsHeroCard kicker={kicker} layout={layout}>
      {showHeroSkeleton ? (
        <RewardsHeroBodySkeleton compact={compactSkeleton} />
      ) : (
        <>
          <RewardsHeroTitle
            isSuperCommunity={hasRank && isSuperCommunity}
            layout={layout}
            superCommunityLabel={superCommunityBadge}
            title={heroTitle}
          />
          <RewardsHeroBody
            hasRank={hasRank}
            heroTierRewardBody={heroTierRewardBody}
            isSuperCommunity={isSuperCommunity}
            superCommunityBenefitBody={superCommunityBenefitBody}
          />
        </>
      )}
    </RewardsHeroCard>
  )
}

export function RewardsHeroSection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { displayRank, heroTitle, isRankLoading } = useShareholderRankLabels(t)
  const { data: communityFundTotal } = useCommunityFundTotal(sessionReady)
  const isSuperCommunity = communityFundTotal?.is_presale_fund_node === true
  const showHeroSkeleton = sessionReady && isRankLoading
  const hasRank = displayRank > 0
  const heroTierRewardBody = hasRank
    ? formatShareholderHintForRank(
        displayRank,
        t.rewards.heroTierRewardBody,
        t.rewards.shareholderNoRankBody,
        buildRewardTierRows(),
      )
    : t.rewards.shareholderNoRankBody

  const panelProps = {
    hasRank,
    heroTierRewardBody,
    heroTitle,
    isSuperCommunity,
    kicker: t.rewards.heroKicker,
    showHeroSkeleton,
    superCommunityBadge: t.rewards.superCommunityBadge,
    superCommunityBenefitBody: t.rewards.superCommunityBenefitBody,
  }

  return (
    <>
      <RewardsHeroPanel {...panelProps} compactSkeleton={false} layout="desktop" />
      <RewardsHeroPanel {...panelProps} compactSkeleton layout="mobile" />
    </>
  )
}
