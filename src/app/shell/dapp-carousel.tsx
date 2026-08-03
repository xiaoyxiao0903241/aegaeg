import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '~/shared/ui/carousel'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'

export type DappCarouselSlide = {
  key: string
  content: ReactNode
}

/**
 * 通用 DApp about 轮播壳（奖励 / 释放…；兑换 TokenAbout 仍自管 peek）。
 * - 卡间距：track `-ml-8` + slide `pl-8`（≡ 兑换 about）
 * - 阴影：viewport 垫 `--shadow-bleed-*`，避免 Embla `overflow-hidden` 裁切
 * - indicator：chevron mask + pill dots（稿 active 22×6 / inactive 6）
 */
const dappCarouselChrome = tv({
  slots: {
    root: 'grid w-full overflow-visible',
    viewport: [
      'overflow-hidden pb-(--shadow-bleed-subtle)',
      'dapp:-mx-7 dapp:w-[calc(100%+3.5rem)] dapp:px-7',
      'max-dapp:-mx-(--shadow-bleed-h5) max-dapp:w-[calc(100%+2*var(--shadow-bleed-h5))] max-dapp:px-(--shadow-bleed-h5) max-dapp:pt-(--carousel-h5-viewport-pad-y)',
    ],
    track: '-ml-8 flex items-stretch',
    slide: 'min-w-0 shrink-0 grow-0 basis-full pl-8',
    indicatorBar: [
      'relative z-1 inline-flex items-center justify-center gap-3.5 self-center',
      '-mt-(--shadow-bleed-subtle) pt-(--carousel-pc-indicator-pt)',
      'max-dapp:-mt-[calc(var(--shadow-bleed-subtle)-var(--carousel-h5-viewport-pad-y))] max-dapp:gap-2.5 max-dapp:pt-(--carousel-h5-indicator-pt)',
    ],
    navButton: [
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-muted-foreground',
      dappIcon({ size: 'base' }),
      'max-dapp:size-(--dapp-icon-lg) max-dapp:rounded-full',
    ],
    chevron: [
      "block bg-current [mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]",
      dappIcon({ size: 'base' }),
      'max-dapp:size-(--dapp-icon-md)',
    ],
    dotGroup: 'inline-flex items-center gap-1.5',
    dotButton: [
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0',
      dappIcon({ size: 'base' }),
    ],
    dot: 'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
  },
  variants: {
    chevronDirection: {
      prev: { chevron: '-rotate-90' },
      next: { chevron: 'rotate-90' },
    },
    dotActive: {
      true: { dot: 'h-1.5 w-5.5 bg-primary max-dapp:w-4.5' },
      false: { dot: 'size-1.5' },
    },
  },
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
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)
  const chrome = dappCarouselChrome()

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
    <div className={cn(chrome.root(), className)}>
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
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
      </Carousel>
      <div className={chrome.indicatorBar()}>
        <button
          aria-label={prevLabel}
          className={chrome.navButton()}
          onClick={() => api?.scrollPrev()}
          type="button"
        >
          <span
            aria-hidden
            className={dappCarouselChrome({ chevronDirection: 'prev' }).chevron()}
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
              <span aria-hidden className={dappCarouselChrome({ dotActive: i === index }).dot()} />
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
            className={dappCarouselChrome({ chevronDirection: 'next' }).chevron()}
          />
        </button>
      </div>
    </div>
  )
}
