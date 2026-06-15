import useEmblaCarousel from 'embla-carousel-react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import {
  CarouselContext,
  type CarouselApi,
  type CarouselOptions,
  type CarouselPlugin,
} from './carousel-context'
import { cn } from '~/lib/utils'
import { useCarousel } from './use-carousel'

export type { CarouselApi, CarouselOptions, CarouselPlugin } from './carousel-context'

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
  children?: ReactNode
}

export const Carousel = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    )
    const viewportNodeRef = useRef<HTMLElement | null>(null)
    const setViewportRef = useCallback(
      (node: HTMLElement | null) => {
        viewportNodeRef.current = node
        carouselRef(node)
      },
      [carouselRef],
    )
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const onSelect = useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext],
    )

    useEffect(() => {
      if (!api || !setApi) {
        return
      }
      setApi(api)
    }, [api, setApi])

    useEffect(() => {
      if (!api) {
        return
      }
      api.on('init', onSelect)
      api.on('reInit', onSelect)
      api.on('select', onSelect)
      return () => {
        api.off('init', onSelect)
        api.off('reInit', onSelect)
        api.off('select', onSelect)
      }
    }, [api, onSelect])

    useEffect(() => {
      if (!api) {
        return
      }
      const node = viewportNodeRef.current
      if (!node) {
        return
      }

      let lastWidth = node.getBoundingClientRect().width
      const observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0
        const becameVisible = lastWidth === 0 && width > 0
        const resizedWhileVisible =
          width > 0 && lastWidth > 0 && Math.abs(width - lastWidth) > 1
        if (becameVisible || resizedWhileVisible) {
          api.reInit()
        }
        lastWidth = width
      })
      observer.observe(node)
      return () => observer.disconnect()
    }, [api])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef: setViewportRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          setApi,
          plugins,
        }}
      >
        <div
          ref={ref}
          className={cn('relative', className)}
          onKeyDownCapture={handleKeyDown}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  },
)
Carousel.displayName = 'Carousel'

export const CarouselContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    viewportClassName?: string
  }
>(({ className, viewportClassName, children, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()
  return (
    <div ref={carouselRef} className={cn('overflow-hidden', viewportClassName)}>
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

export const CarouselItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { orientation } = useCarousel()
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
CarouselItem.displayName = 'CarouselItem'
