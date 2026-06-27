import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import { dappAssets } from '~/app/assets'
import { RewardsHeroBodySkeleton } from '~/app/components/dapp-skeleton'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { useDappShell } from '~/app/dapp-shell-context'

export function RewardsHeroSection() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { heroBody, heroTitle, isRankLoading } = useShareholderRankLabels(t)
  const showHeroSkeleton = sessionReady && isRankLoading

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
          <span className="text-[11px] font-semibold uppercase leading-[1.2] tracking-[0.88px] text-coral-bright">
            {t.rewards.heroKicker}
          </span>
          {showHeroSkeleton ? (
            <RewardsHeroBodySkeleton />
          ) : (
            <>
              <h3 className="m-0 text-[21px] font-semibold leading-[1.3] tracking-[-0.63px] text-white">
                {heroTitle}
              </h3>
              <p className="m-0 text-[13px] leading-[1.5] tracking-[-0.26px] text-on-dark">
                {heroBody}
              </p>
            </>
          )}
        </div>
        <img
          alt=""
          className="pointer-events-none absolute right-3 top-[-43px] z-0 h-48 w-32 max-w-32 -scale-x-100 object-contain"
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
          <span className="text-[11px] font-semibold uppercase leading-[1.2] tracking-[0.88px] text-coral-bright">
            {t.rewards.heroKicker}
          </span>
          {showHeroSkeleton ? (
            <RewardsHeroBodySkeleton compact />
          ) : (
            <>
              <h3 className="m-0 text-lg font-semibold leading-[1.2] tracking-[-0.54px] text-white">
                {heroTitle}
              </h3>
              <p className="m-0 text-[13px] leading-[1.5] tracking-[-0.26px] text-on-dark">
                {heroBody}
              </p>
            </>
          )}
        </div>
      </section>
    </>
  )
}
