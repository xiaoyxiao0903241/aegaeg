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
import {
  dappCaptionClass,
  dappKickerClass,
  dappRankTitleClass,
  dappTitleSmClass,
} from '~/app/dapp-type-scale'
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
  const showSuperBadge = hasRank && isSuperCommunity
  const title = formatRankTitleWithBadge(heroTitle, showSuperBadge, superCommunityBadge)

  return (
    <RewardsHeroCard kicker={kicker} layout={layout}>
      {showHeroSkeleton ? (
        <RewardsHeroBodySkeleton compact={compactSkeleton} />
      ) : (
        <>
          <h3
            className={cn(
              'm-0 min-w-0 break-words text-white',
              layout === 'desktop'
                ? cn(dappRankTitleClass, dappTitleSmClass)
                : 'text-lg font-semibold leading-[1.2] tracking-[-0.54px]',
            )}
          >
            {title}
          </h3>
          <div className={cn('m-0 flex flex-col gap-0 text-on-dark', dappCaptionClass)}>
            <p className="m-0">{heroTierRewardBody}</p>
            {showSuperBadge ? (
              <p className="m-0">{superCommunityBenefitBody}</p>
            ) : null}
          </div>
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
