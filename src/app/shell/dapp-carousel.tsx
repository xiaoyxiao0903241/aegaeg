import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '~/shared/ui/carousel'
import { cn } from '~/shared/lib/utils'

export type DappCarouselSlide = {
  key: string
  content: ReactNode
}

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
    <div className={className}>
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.key}>{slide.content}</CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          aria-label={prevLabel}
          className="grid size-4 place-items-center text-muted-foreground"
          onClick={() => api?.scrollPrev()}
          type="button"
        >
          ‹
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              aria-label={slide.key}
              className={cn(
                'rounded-full transition-[width,background-color]',
                i === index ? 'h-1.5 w-5.5 bg-primary' : 'size-1.5 bg-border',
              )}
              key={slide.key}
              onClick={() => api?.scrollTo(i)}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label={nextLabel}
          className="grid size-4 place-items-center text-muted-foreground"
          onClick={() => api?.scrollNext()}
          type="button"
        >
          ›
        </button>
      </div>
    </div>
  )
}
