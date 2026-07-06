import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { dappAssets } from '~/app/assets'
import { RankTitleWithSuperCommunity } from '~/app/components/rank-title-with-super-community'
import {
  dappCaptionClass,
  dappKickerClass,
  dappTitleSmClass,
} from '~/app/dapp-type-scale'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

const rewardsHeroCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'relative overflow-hidden rounded-md bg-dark text-white shadow-card',
    ),
    content: 'relative z-1 flex flex-col gap-2',
    kicker: cn(dappKickerClass, 'text-coral-bright'),
    titleDesktop: cn('m-0 text-white', dappTitleSmClass),
    titleMobile:
      'm-0 text-lg font-semibold leading-[1.2] tracking-[-0.54px] text-white',
    body: cn('m-0 flex flex-col gap-0 text-on-dark', dappCaptionClass),
    character: cn(
      'pointer-events-none absolute right-3 top-[-2.6875rem] z-0 h-48 w-32 max-w-32 -scale-x-100 select-none object-contain',
    ),
  },
  variants: {
    layout: {
      desktop: {
        root: 'flex min-h-36 items-center justify-between gap-6 overflow-visible p-6 max-dapp:hidden',
        content: 'min-w-0 flex-1 pr-36',
      },
      mobile: {
        root: 'hidden min-h-32 overflow-visible p-4.5 max-dapp:flex max-dapp:flex-col max-dapp:gap-2',
        content: '',
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
        <span className={styles.kicker()}>{kicker}</span>
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

export function RewardsHeroTitle({
  isSuperCommunity,
  layout,
  superCommunityLabel,
  title,
}: {
  isSuperCommunity: boolean
  layout: 'desktop' | 'mobile'
  superCommunityLabel: string
  title: string
}) {
  const styles = rewardsHeroCard({ layout })

  return (
    <RankTitleWithSuperCommunity
      as="h3"
      className={layout === 'desktop' ? styles.titleDesktop() : styles.titleMobile()}
      isSuperCommunity={isSuperCommunity}
      superCommunityLabel={superCommunityLabel}
      title={title}
    />
  )
}

export function RewardsHeroBodyCopy({ children }: { children: ReactNode }) {
  const styles = rewardsHeroCard({ layout: 'desktop' })
  return <div className={styles.body()}>{children}</div>
}
