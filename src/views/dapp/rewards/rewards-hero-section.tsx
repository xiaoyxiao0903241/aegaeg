import { useI18n } from '~/i18n/use-i18n'
import { RewardsHeroBodySkeleton } from '~/app/shell/components/dapp-skeleton'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { useDappShell } from '~/app/dapp-shell-context'
import { useCommunityFundTotal } from '~/hooks/use-api-data'
import {
  formatRankTitleWithBadge,
  formatShareholderHintForRank,
} from '~/shared/api/format-display'
import { buildRewardTierRows } from '~/core/presale/tier-table'
import { dappDarkBanner } from '~/shared/ui/dapp-dark-banner'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'
import { RewardsHeroCard } from '~/views/dapp/rewards/rewards-hero-card'

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
  const banner = dappDarkBanner()
  const showSuperBadge = hasRank && isSuperCommunity
  const title = formatRankTitleWithBadge(heroTitle, showSuperBadge, superCommunityBadge)

  return (
    <RewardsHeroCard kicker={kicker} layout={layout}>
      {showHeroSkeleton ? (
        <RewardsHeroBodySkeleton compact={compactSkeleton} />
      ) : (
        <>
          <Text
            as="h3"
            variant={layout === 'desktop' ? 'title' : 'value-lg'}
            tone="inverse"
            className={cn(banner.title(), 'block min-w-0 break-words')}
          >
            {title}
          </Text>
          <Text as="p" variant="caption" tone="inverse" className={cn('m-0 opacity-[0.72]', banner.body())}>
            {heroTierRewardBody}
          </Text>
          {showSuperBadge ? (
            <Text as="p" variant="caption" tone="inverse" className={cn('m-0 opacity-[0.72]', banner.body())}>
              {superCommunityBenefitBody}
            </Text>
          ) : null}
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
