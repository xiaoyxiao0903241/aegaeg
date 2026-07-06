import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { dappAssets } from '~/app/assets'
import { RankTitleWithSuperCommunity } from '~/app/components/rank-title-with-super-community'
import {
  DappDarkBannerBody,
  DappDarkBannerKicker,
  dappDarkBanner,
} from '~/shared/ui/dapp-dark-banner'
import { cn } from '~/lib/utils'

const rewardsHeroCard = tv({
  slots: {
    root: dappDarkBanner().root(),
    content: dappDarkBanner().content(),
    kicker: dappDarkBanner().kicker(),
    titleDesktop: cn(dappDarkBanner().title(), 'm-0'),
    titleMobile:
      'm-0 text-lg font-semibold leading-[1.2] tracking-[-0.54px] text-white',
    body: cn(dappDarkBanner().body(), 'm-0 flex flex-col gap-0'),
    character: cn(
      dappDarkBanner().decoration(),
      'right-3 top-[-2.6875rem] z-0 h-48 w-32 max-w-32 -scale-x-100 object-contain',
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
        <DappDarkBannerKicker className={styles.kicker()}>{kicker}</DappDarkBannerKicker>
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
  return <DappDarkBannerBody className={styles.body()}>{children}</DappDarkBannerBody>
}
