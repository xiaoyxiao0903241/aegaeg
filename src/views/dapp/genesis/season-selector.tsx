import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '~/shared/ui/carousel'
import { RadioGroup, RadioIndicator } from '~/shared/ui/radio'
import { Text } from '~/shared/ui/text'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/shared/lib/reveal'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'
import { seasonCard, seasonCarousel } from '~/views/dapp/genesis/season-card'
import { cn } from '~/shared/lib/utils'

function translateSeasonStatus(status: string, t: ReturnType<typeof useI18n>['messages']) {
  if (status === 'LIVE') return t.genesis.seasonLive
  if (status === 'Ended') return t.genesis.seasonEnded
  if (status === 'Upcoming') return t.genesis.seasonUpcoming
  return status
}

import type { SeasonOption } from '~/core/presale/genesis-promo-types'

export type { SeasonOption } from '~/core/presale/genesis-promo-types'

function resolveSeasonCarouselScrollIndex(activeIndex: number): number {
  if (activeIndex <= 0) {
    return 0
  }
  // Keep the current phase as the 2nd visible card when possible.
  return activeIndex - 1
}

function useCarouselScrollState(api: CarouselApi | undefined) {
  const [current, setCurrent] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) {
      return
    }
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }
    handleSelect()
    api.on('select', handleSelect)
    api.on('reInit', handleSelect)
    return () => {
      api.off('select', handleSelect)
      api.off('reInit', handleSelect)
    }
  }, [api])

  const goTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  return { canScrollNext, canScrollPrev, current, goTo }
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
    <article
      aria-checked={selected}
      className={styles.root()}
      role="radio"
    >
      <div className="flex w-full flex-col gap-0.75 overflow-hidden">
        <div className="flex h-4.5 items-center justify-between gap-1">
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

export function SeasonSelector({
  activePhaseIndex,
  seasons,
}: {
  activePhaseIndex?: number
  seasons: SeasonOption[]
}) {
  const { messages: t } = useI18n()
  const [api, setApi] = useState<CarouselApi>()
  const { canScrollNext, canScrollPrev, current, goTo } = useCarouselScrollState(api)
  const syncedScrollIndexRef = useRef<number | null>(null)
  const showControls = seasons.length > 1
  const carousel = seasonCarousel()
  const activeSeasonIndex = useMemo(() => {
    if (activePhaseIndex !== undefined && activePhaseIndex >= 0) {
      return activePhaseIndex
    }
    return seasons.findIndex((season) => season.active)
  }, [activePhaseIndex, seasons])
  const initialScrollIndex = useMemo(
    () => resolveSeasonCarouselScrollIndex(activeSeasonIndex),
    [activeSeasonIndex],
  )
  const carouselOpts = useMemo(
    () => ({
      align: 'start' as const,
      containScroll: 'trimSnaps' as const,
      dragFree: false,
      startIndex: initialScrollIndex,
    }),
    [initialScrollIndex],
  )

  useEffect(() => {
    if (!api || activeSeasonIndex < 0) {
      return
    }
    if (syncedScrollIndexRef.current === initialScrollIndex) {
      return
    }
    api.scrollTo(initialScrollIndex, false)
    syncedScrollIndexRef.current = initialScrollIndex
  }, [activeSeasonIndex, api, initialScrollIndex])

  return (
    <RadioGroup
      aria-label={t.genesis.statsTitle}
      className={cn(revealClass(), 'mb-1.5 min-w-0')}
      data-reveal
    >
      <Carousel
        aria-label={t.genesis.statsTitle}
        className={carousel.root()}
        opts={carouselOpts}
        setApi={setApi}
      >
        <div className={carousel.bleed()}>
          <CarouselContent
            className={carousel.track()}
            spacing="none"
            viewportClassName={carousel.viewport()}
          >
            {seasons.map((season) => (
              <CarouselItem className={carousel.slide()} key={season.name} spacing="none">
                <SeasonCard season={season} t={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {showControls ? (
            <>
              <div
                aria-hidden="true"
                className={seasonCarousel({
                  fadeSide: 'left',
                  fadeVisible: canScrollPrev,
                }).fade()}
              />
              <div
                aria-hidden="true"
                className={seasonCarousel({
                  fadeSide: 'right',
                  fadeVisible: canScrollNext,
                }).fade()}
              />
            </>
          ) : null}
        </div>
        {showControls ? (
          <div className="flex w-full items-center justify-center gap-3.5">
            <button
              aria-label={t.swap.tokenPrevious}
              className={cn(
                'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-muted-foreground',
                dappIcon({ size: 'base' }),
              )}
              onClick={() => api?.scrollPrev()}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block -rotate-90 bg-current [mask:url(\'/assets/figma/dapp/ic-chevron.svg\')_center/contain_no-repeat]',
                  dappIcon({ size: 'base' }),
                )}
              />
            </button>
            <span
              aria-label={t.genesis.statsTitle}
              className="inline-flex items-center gap-1.5"
              role="group"
            >
              {seasons.map((season, index) => (
                <button
                  aria-current={current === index ? 'true' : undefined}
                  aria-label={`${season.name}`}
                  className={cn(
                    'grid cursor-pointer place-items-center border-0 bg-transparent p-0',
                    dappIcon({ size: 'base' }),
                  )}
                  key={season.name}
                  onClick={() => goTo(index)}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
                      current === index ? 'h-1.75 w-5.5 bg-primary' : 'size-1.75',
                    )}
                  />
                </button>
              ))}
            </span>
            <button
              aria-label={t.swap.tokenNext}
              className={cn(
                'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-muted-foreground',
                dappIcon({ size: 'base' }),
              )}
              onClick={() => api?.scrollNext()}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block rotate-90 bg-current [mask:url(\'/assets/figma/dapp/ic-chevron.svg\')_center/contain_no-repeat]',
                  dappIcon({ size: 'base' }),
                )}
              />
            </button>
          </div>
        ) : null}
      </Carousel>
    </RadioGroup>
  )
}
