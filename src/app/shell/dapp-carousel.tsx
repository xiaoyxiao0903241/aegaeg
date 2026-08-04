import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '~/shared/components/carousel'
import { dappIcon } from '~/shared/components/dapp-icon-scale'
import { cn } from '~/shared/lib/utils'

export type DappCarouselSlide = {
  key: string
  content: ReactNode
}

type CarouselLayout = 'desktop' | 'mobile'

/**
 * 通用 DApp about 轮播壳（奖励 / 释放…；兑换 TokenAbout 仍自管）。
 * H5/PC 分轨与 `TokenAboutCarousel` 同构：`useMobileViewport` + 同 bleed / Embla opts，
 * 避免仅靠 `max-dapp:` 与兑换行为漂移。
 */
const dappCarouselChrome = tv({
  slots: {
    root: 'grid w-full overflow-visible',
    viewport: '',
    track: '-ml-8 flex items-stretch',
    slide: 'flex w-full max-w-full min-w-0 shrink-0 grow-0 basis-full flex-col pl-8',
    indicatorBar: 'inline-flex items-center justify-center self-center',
    navButton:
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-muted-foreground',
    chevron:
      "block bg-current [mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]",
    dotGroup: 'inline-flex items-center gap-1.5',
    dotButton: [
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0',
      dappIcon({ size: 'base' }),
    ],
    dot: 'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
  },
  variants: {
    layout: {
      desktop: {
        root: 'gap-0',
        viewport: 'dapp:-mx-7 dapp:w-[calc(100%+3.5rem)] dapp:px-7 dapp:pb-(--shadow-bleed-subtle)',
        indicatorBar: [
          'gap-3.5',
          'relative z-1 -mt-(--shadow-bleed-subtle) pt-(--carousel-pc-indicator-pt)',
        ],
        navButton: dappIcon({ size: 'base' }),
        chevron: dappIcon({ size: 'base' }),
      },
      mobile: {
        viewport: [
          '-mx-(--shadow-bleed-h5) w-[calc(100%+2*var(--shadow-bleed-h5))]',
          'px-(--shadow-bleed-h5) pt-(--carousel-h5-viewport-pad-y) pb-(--shadow-bleed-subtle)',
        ].join(' '),
        indicatorBar: [
          'gap-2.5',
          'relative z-1 -mt-[calc(var(--shadow-bleed-subtle)-var(--carousel-h5-viewport-pad-y))]',
          'pt-(--carousel-h5-indicator-pt)',
        ].join(' '),
        navButton: 'size-(--dapp-icon-lg) rounded-full',
        chevron: dappIcon({ size: 'md' }),
      },
    },
    chevronDirection: {
      prev: { chevron: '-rotate-90' },
      next: { chevron: 'rotate-90' },
    },
    dotActive: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    { layout: 'desktop', dotActive: true, class: { dot: 'h-1.5 w-5.5 bg-primary' } },
    { layout: 'mobile', dotActive: true, class: { dot: 'h-1.5 w-4.5 bg-primary' } },
    { layout: 'desktop', dotActive: false, class: { dot: 'size-1.5' } },
    { layout: 'mobile', dotActive: false, class: { dot: 'size-1.5' } },
  ],
})

export function DappCarousel({
  className,
  nextLabel = 'next',
  prevLabel = 'prev',
  slides,
}: {
  className?: string
  nextLabel?: string
  prevLabel?: string
  slides: readonly DappCarouselSlide[]
}) {
  const isMobile = useMobileViewport()
  const layout: CarouselLayout = isMobile ? 'mobile' : 'desktop'
  const chrome = dappCarouselChrome({ layout })
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!api) return
    setIndex(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  return (
    <Carousel
      className={cn(chrome.root(), className)}
      opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}
      setApi={setApi}
    >
      <CarouselContent
        className={chrome.track()}
        spacing="none"
        viewportClassName={chrome.viewport()}
      >
        {slides.map((slide) => (
          <CarouselItem className={chrome.slide()} key={slide.key} spacing="none">
            {slide.content}
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className={chrome.indicatorBar()}>
        <button
          aria-label={prevLabel}
          className={chrome.navButton()}
          onClick={() => api?.scrollPrev()}
          type="button"
        >
          <span
            aria-hidden
            className={dappCarouselChrome({ layout, chevronDirection: 'prev' }).chevron()}
          />
        </button>
        <div className={chrome.dotGroup()} role="group">
          {slides.map((slide, i) => (
            <button
              aria-current={i === index ? 'true' : undefined}
              aria-label={slide.key}
              className={chrome.dotButton()}
              key={slide.key}
              onClick={() => api?.scrollTo(i)}
              type="button"
            >
              <span
                aria-hidden
                className={dappCarouselChrome({ layout, dotActive: i === index }).dot()}
              />
            </button>
          ))}
        </div>
        <button
          aria-label={nextLabel}
          className={chrome.navButton()}
          onClick={() => api?.scrollNext()}
          type="button"
        >
          <span
            aria-hidden
            className={dappCarouselChrome({ layout, chevronDirection: 'next' }).chevron()}
          />
        </button>
      </div>
    </Carousel>
  )
}
