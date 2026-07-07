import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { dappAssets } from '~/app/assets'
import { dappDarkBanner } from '~/shared/ui/dapp-dark-banner'
import { dappKickerClass } from '~/app/dapp-type-scale'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

const rewardsHeroCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'relative overflow-hidden rounded-md bg-dark text-white shadow-card',
    ),
    content: 'relative z-1 flex flex-col gap-2',
    character: cn(
      'pointer-events-none absolute right-3 top-[-2.6875rem] z-0 h-48 w-32 max-w-32 -scale-x-100 select-none object-contain',
    ),
  },
  variants: {
    layout: {
      desktop: {
        root: cn(
          dappDarkBanner().root(),
          'flex min-h-36 items-center justify-between gap-6 overflow-visible p-6 max-dapp:hidden',
        ),
        content: cn(dappDarkBanner().content(), 'min-w-0 flex-1 pr-36'),
      },
      mobile: {
        root: cn(
          dappDarkBanner().root(),
          'hidden min-h-32 overflow-visible p-4.5 max-dapp:flex max-dapp:flex-col max-dapp:gap-2',
        ),
        content: dappDarkBanner().content(),
      },
    },
  },
})

export function RewardsHeroCard({
  children,
  kicker,
  layout,
}: {
  children: ReactNode
  kicker: string
  layout: 'desktop' | 'mobile'
}) {
  const styles = rewardsHeroCard({ layout })

  return (
    <section className={styles.root()} data-reveal={layout === 'desktop' ? '' : undefined}>
      <div className={styles.content()}>
        <span className={cn(dappKickerClass, 'text-coral-bright')}>
          {kicker}
        </span>
        {children}
      </div>
      {layout === 'desktop' ? (
        <img
          alt=""
          className={styles.character()}
          height="156"
          loading="lazy"
          src={dappAssets.rewardsCharacter}
          width="104"
        />
      ) : null}
    </section>
  )
}
