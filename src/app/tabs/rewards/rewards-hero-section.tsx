import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import { dappAssets } from '~/app/assets'
import { RewardsHeroBodySkeleton } from '~/app/components/dapp-skeleton'
import {
  dappCaptionClass,
  dappKickerClass,
  dappTitleSmClass,
} from '~/app/dapp-type-scale'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { useDappShell } from '~/app/dapp-shell-context'
import { useCommunityFundTotal } from '~/hooks/use-api-data'
import { formatShareholderHintForRank } from '~/lib/api/format-display'
import { buildRewardTierRows } from '~/lib/presale/tier-table'
import { RankTitleWithSuperCommunity } from '~/app/components/rank-title-with-super-community'

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

  return (
    <>
      <section
        className={cn(
          revealClass(),
          'relative flex min-h-36 items-center justify-between gap-6 overflow-visible rounded-md bg-dark p-6 text-white shadow-card',
          'max-dapp:hidden',
        )}
        data-reveal
      >
        <div className="relative z-1 flex min-w-0 flex-1 flex-col gap-2 pr-36">
          <span className={cn(dappKickerClass, 'text-coral-bright')}>
            {t.rewards.heroKicker}
          </span>
          {showHeroSkeleton ? (
            <RewardsHeroBodySkeleton />
          ) : (
            <>
              <RankTitleWithSuperCommunity
                as="h3"
                className={cn('m-0 text-white', dappTitleSmClass)}
                isSuperCommunity={hasRank && isSuperCommunity}
                superCommunityLabel={t.rewards.superCommunityBadge}
                title={heroTitle}
              />
              <div className={cn('m-0 flex flex-col gap-0 text-on-dark', dappCaptionClass)}>
                <p className="m-0">{heroTierRewardBody}</p>
                {hasRank && isSuperCommunity ? (
                  <p className="m-0">{t.rewards.superCommunityBenefitBody}</p>
                ) : null}
              </div>
            </>
          )}
        </div>
        <img
          alt=""
          className="pointer-events-none absolute right-3 top-[-2.6875rem] z-0 h-48 w-32 max-w-32 -scale-x-100 object-contain"
          height="156"
          loading="lazy"
          src={dappAssets.rewardsCharacter}
          width="104"
        />
      </section>

      <section
        className={cn(
          'relative hidden min-h-32 overflow-visible rounded-md bg-dark p-4.5 text-white shadow-card',
          'max-dapp:flex max-dapp:flex-col max-dapp:gap-2',
        )}
      >
        <div className="relative z-1 flex flex-col gap-2">
          <span className={cn(dappKickerClass, 'text-coral-bright')}>
            {t.rewards.heroKicker}
          </span>
          {showHeroSkeleton ? (
            <RewardsHeroBodySkeleton compact />
          ) : (
            <>
              <RankTitleWithSuperCommunity
                as="h3"
                className="m-0 text-lg font-semibold leading-[1.2] tracking-[-0.54px] text-white"
                isSuperCommunity={hasRank && isSuperCommunity}
                superCommunityLabel={t.rewards.superCommunityBadge}
                title={heroTitle}
              />
              <div className={cn('m-0 flex flex-col gap-0 text-on-dark', dappCaptionClass)}>
                <p className="m-0">{heroTierRewardBody}</p>
                {hasRank && isSuperCommunity ? (
                  <p className="m-0">{t.rewards.superCommunityBenefitBody}</p>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
