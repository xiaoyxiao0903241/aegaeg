import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '~/components/carousel'
import { RadioGroup, RadioIndicator } from '~/components/radio'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { dappIconClass } from '~/app/dapp-icon-scale'
import {
  seasonCardBadgeClass,
  seasonCardMetaClass,
  seasonCardRadiusClass,
  seasonCardRadioClass,
  seasonCardSizeClass,
  seasonCardTitleClass,
  seasonCarouselControlsGapClass,
  seasonCarouselEdgeBleedClass,
  seasonCarouselEdgeFadeClass,
  seasonCarouselMaxWidthClass,
  seasonCarouselSlideGapClass,
  seasonCarouselTrackBleedClass,
  seasonCarouselViewportClass,
} from '~/app/dapp-detail-layout'
import { cn } from '~/lib/utils'

function translateSeasonStatus(status: string, t: ReturnType<typeof useI18n>['messages']) {
  if (status === 'LIVE') return t.genesis.seasonLive
  if (status === 'Ended') return t.genesis.seasonEnded
  if (status === 'Upcoming') return t.genesis.seasonUpcoming
  return status
}

export type SeasonOption = {
  active?: boolean
  date: string
  desktopMeta: {
    airdrop: string
    discount: string
  }
  discount: string
  name: string
  price: string
  status: string
}

/** Figma `4150:19854` — 8.75×7.8125rem card, 0.625rem gap, ~3.25rem peek @ 22rem viewport */
const SEASON_CARD_CLASS = cn(
  'flex shrink-0 flex-col gap-1.5 border bg-card p-3',
  seasonCardRadiusClass,
  seasonCardSizeClass,
)

const SEASON_META_ACCENT_CLASS = 'text-[#e9785a]'

const seasonStatusBadgeBaseClass = cn(
  'flex w-full items-center justify-center rounded-full px-2.25 py-0.5 whitespace-nowrap',
  seasonCardBadgeClass,
)

function resolveSeasonStatusBadgeClass(status: string, selected: boolean) {
  if (status === 'LIVE' && selected) {
    return cn(seasonStatusBadgeBaseClass, 'bg-accent text-primary')
  }

  return cn(seasonStatusBadgeBaseClass, 'bg-muted text-muted-foreground')
}

function resolveSeasonCarouselScrollIndex(activeIndex: number): number {
  if (activeIndex <= 0) {
    return 0
  }
  // Figma peek layout — keep the current phase as the 2nd visible card when possible.
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

  return (
    <article
      aria-checked={selected}
      className={cn(SEASON_CARD_CLASS, selected ? 'border-primary' : 'border-border')}
      role="radio"
    >
      <div className="flex items-start justify-between gap-1">
        <strong className={seasonCardTitleClass}>{season.name}</strong>
        <RadioIndicator checked={selected} className={seasonCardRadioClass} />
      </div>
      <p className={cn('m-0', seasonCardMetaClass)}>
        {t.genesis.discountLabel}{' '}
        <span className={SEASON_META_ACCENT_CLASS}>{season.desktopMeta.discount}</span>
      </p>
      <p className={cn('m-0', seasonCardMetaClass)}>
        {t.genesis.airdropLabel}{' '}
        <span className={SEASON_META_ACCENT_CLASS}>{season.desktopMeta.airdrop}</span>
      </p>
      <time className={seasonCardMetaClass}>{season.date}</time>
      <div className="mt-auto w-full">
        <span className={resolveSeasonStatusBadgeClass(season.status, selected)}>
          {translateSeasonStatus(season.status, t)}
        </span>
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
        className={cn(
          'flex min-w-0 flex-col overflow-visible',
          seasonCarouselMaxWidthClass,
          seasonCarouselControlsGapClass,
        )}
        opts={carouselOpts}
        setApi={setApi}
      >
        <div className={cn('relative overflow-visible', seasonCarouselEdgeBleedClass)}>
          <CarouselContent
            className={cn('flex items-stretch', seasonCarouselTrackBleedClass)}
            spacing="none"
            viewportClassName={seasonCarouselViewportClass}
          >
            {seasons.map((season) => (
              <CarouselItem
                className={cn('shrink-0 grow-0 basis-auto', seasonCarouselSlideGapClass)}
                key={season.name}
                spacing="none"
              >
                <SeasonCard season={season} t={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {showControls ? (
            <>
              <div
                aria-hidden="true"
                className={seasonCarouselEdgeFadeClass('left', canScrollPrev)}
              />
              <div
                aria-hidden="true"
                className={seasonCarouselEdgeFadeClass('right', canScrollNext)}
              />
            </>
          ) : null}
        </div>
        {showControls ? (
          <div className="flex w-full items-center justify-center gap-3.5">
            <button
              aria-label={t.swap.tokenPrevious}
              className={cn(
                'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-faint',
                dappIconClass.base,
              )}
              onClick={() => api?.scrollPrev()}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block -rotate-90 bg-current [mask:url(\'/assets/figma/dapp/ic-chevron.svg\')_center/contain_no-repeat]',
                  dappIconClass.base,
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
                    dappIconClass.base,
                  )}
                  key={season.name}
                  onClick={() => goTo(index)}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
                      current === index ? 'h-1.5 w-5.5 bg-primary' : 'h-1.5 w-1.5',
                    )}
                  />
                </button>
              ))}
            </span>
            <button
              aria-label={t.swap.tokenNext}
              className={cn(
                'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-faint',
                dappIconClass.base,
              )}
              onClick={() => api?.scrollNext()}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block rotate-90 bg-current [mask:url(\'/assets/figma/dapp/ic-chevron.svg\')_center/contain_no-repeat]',
                  dappIconClass.base,
                )}
              />
            </button>
          </div>
        ) : null}
      </Carousel>
    </RadioGroup>
  )
}
