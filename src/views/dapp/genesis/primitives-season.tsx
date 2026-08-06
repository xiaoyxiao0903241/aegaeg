/**
 * 创世季卡 / 轮播 / 骨架
 */

import { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { SeasonOption } from '~/core/presale/genesis-promo-types'
import { useI18n } from '~/i18n/use-i18n'
import { Carousel } from '~/shared/components/carousel'
import { RadioGroup, RadioIndicator } from '~/shared/components/radio'
import { Skeleton } from '~/shared/components/skeleton'
import { Text } from '~/shared/components/text'
import { cn, revealClass } from '~/shared/lib/utils'

/**
 * 创世季卡样式
 *
 * 只负责布局与配色，字重行距跟随 Text 组件；
 * 选中/进行中为强调色，已结束为弱化色。
 */
export const seasonCard = tv({
  slots: {
    root: [
      'flex shrink-0 flex-col gap-1.5 border bg-card p-3',
      'w-35',
      'rounded-(--dapp-season-card-radius)',
    ],
    /** 仅设置字号；字重/行高/字距跟随 Text 变体 */
    title: 'text-(length:--dapp-season-title-size) text-foreground',
    // meta 用常规字重；badge 覆盖为中粗字重
    meta: 'm-0 text-(length:--dapp-season-meta-size) text-muted-foreground',
    metaAccent: 'text-coral-emphasis',
    radio: 'size-(--dapp-season-radio-size) rounded-[calc(var(--dapp-season-radio-size)/2)]',
    badge:
      'flex w-full items-center justify-center rounded-full px-2.25 py-0.5 text-(length:--dapp-season-badge-size) font-medium whitespace-nowrap',
  },
  variants: {
    selected: {
      true: {
        root: 'border-coral',
        radio: 'border-coral [&_span]:bg-coral',
      },
      false: {
        root: 'border-border',
      },
    },
    status: {
      live: { badge: 'bg-accent text-coral' },
      ended: { badge: 'bg-band text-muted-foreground' },
    },
  },
  defaultVariants: {
    selected: false,
    status: 'ended',
  },
})

function translateSeasonStatus(status: string, t: ReturnType<typeof useI18n>['messages']) {
  if (status === 'LIVE') return t.genesis.seasonLive
  if (status === 'Ended') return t.genesis.seasonEnded
  if (status === 'Upcoming') return t.genesis.seasonUpcoming
  return status
}

function SeasonCard({
  season,
  t,
}: {
  season: SeasonOption
  t: ReturnType<typeof useI18n>['messages']
}) {
  const selected = Boolean(season.active)
  const liveSelected = season.status === 'LIVE' && selected
  const styles = seasonCard({
    selected,
    status: liveSelected ? 'live' : 'ended',
  })

  return (
    <article aria-checked={selected} className={styles.root()} role="radio">
      <div className="flex w-full flex-col gap-0.75 overflow-hidden">
        <div className="flex items-center justify-between gap-1">
          <Text as="strong" variant="headline" className={styles.title()}>
            {season.name}
          </Text>
          <RadioIndicator checked={selected} className={styles.radio()} />
        </div>
        <Text as="p" variant="caption" className={styles.meta()}>
          {t.genesis.discountLabel}{' '}
          <Text as="span" variant="caption" className={styles.metaAccent()}>
            {season.desktopMeta.discount}
          </Text>
        </Text>
        <Text as="p" variant="caption" className={styles.meta()}>
          {t.genesis.airdropLabel}{' '}
          <Text as="span" variant="caption" className={styles.metaAccent()}>
            {season.desktopMeta.airdrop}
          </Text>
        </Text>
        <Text as="time" variant="caption" className={styles.meta()}>
          {season.date}
        </Text>
      </div>
      <div className="mt-auto w-full">
        <Text as="span" variant="caption" className={styles.badge()}>
          {translateSeasonStatus(season.status, t)}
        </Text>
      </div>
    </article>
  )
}

/**
 * 创世季卡轮播
 *
 * 卡片选中态自管；滚动条带、渐隐与指示器交给 Carousel 组件。
 */
export function GenesisSeasonCarousel({
  activePhaseIndex,
  seasons,
}: {
  activePhaseIndex?: number
  seasons: SeasonOption[]
}) {
  const { messages: t } = useI18n()
  const activeSeasonIndex = useMemo(() => {
    if (activePhaseIndex !== undefined && activePhaseIndex >= 0) {
      return activePhaseIndex
    }
    return seasons.findIndex((season) => season.active)
  }, [activePhaseIndex, seasons])
  const syncIndex = activeSeasonIndex >= 0 ? activeSeasonIndex : undefined

  return (
    <RadioGroup
      aria-label={t.genesis.title}
      className={cn(revealClass(), 'mb-1.5 min-w-0')}
      data-reveal
    >
      <Carousel
        aria-label={t.genesis.title}
        className="flex w-full min-w-0 flex-col gap-2.5 overflow-visible"
        opts={{
          align: 'start',
          containScroll: 'trimSnaps',
          dragFree: false,
          startIndex: syncIndex ?? 0,
        }}
        syncIndex={syncIndex}
      >
        <Carousel.Content chrome="peek">
          {seasons.map((season) => (
            <Carousel.Item key={season.name}>
              <SeasonCard season={season} t={t} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Carousel.Indicators
          chrome="plain"
          dotLabel={(index) => seasons[index]?.name ?? String(index + 1)}
          nextLabel={t.exchange.tokenNext}
          prevLabel={t.exchange.tokenPrevious}
        />
      </Carousel>
    </RadioGroup>
  )
}

// --- from season/genesis-season-option-skeleton.tsx ---
export function SeasonOptionSkeleton() {
  return (
    <div aria-hidden="true" className={seasonCard({ selected: false }).root()}>
      <div className="flex items-start justify-between gap-1">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="size-(--dapp-skeleton-chip-size) shrink-0 rounded-[calc(var(--dapp-skeleton-chip-size)/2)]" />
      </div>
      <Skeleton className="h-3 w-full max-w-24" />
      <Skeleton className="h-3 w-full max-w-28" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-auto w-full rounded-full" />
    </div>
  )
}
