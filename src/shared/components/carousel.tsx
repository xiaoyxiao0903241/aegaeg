import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { cn } from '~/shared/lib/utils'

export type CarouselApi = EmblaCarouselType | undefined
export type CarouselOptions = EmblaOptionsType | undefined
export type CarouselPlugin = EmblaPluginType[] | undefined

type CarouselRootProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
  children?: ReactNode
}

type CarouselContextProps = CarouselRootProps & {
  carouselRef: (instance: HTMLElement | null) => void
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return context
}

export const Carousel = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & CarouselRootProps
>(({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
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
      const resizedWhileVisible = width > 0 && lastWidth > 0 && Math.abs(width - lastWidth) > 1
      if (becameVisible || resizedWhileVisible) {
        api.reInit()
      }
      lastWidth = width
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [api])

  const contextValue = useMemo(
    () => ({
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
    }),
    [
      setViewportRef,
      api,
      opts,
      orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      setApi,
      plugins,
    ],
  )

  return (
    <CarouselContext.Provider value={contextValue}>
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
})
Carousel.displayName = 'Carousel'

export const CarouselContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    spacing?: 'default' | 'none'
    viewportClassName?: string
  }
>(({ className, spacing = 'default', viewportClassName, children, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()
  const isHorizontal = orientation === 'horizontal'
  return (
    <div ref={carouselRef} className={cn('overflow-hidden', viewportClassName)}>
      <div
        ref={ref}
        className={cn(
          'flex',
          spacing === 'default' && (isHorizontal ? '-ml-4' : '-mt-4'),
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
  HTMLAttributes<HTMLDivElement> & {
    spacing?: 'default' | 'none'
  }
>(({ className, spacing = 'default', children, ...props }, ref) => {
  const { orientation } = useCarousel()
  const isHorizontal = orientation === 'horizontal'
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        spacing === 'default' && (isHorizontal ? 'pl-4' : 'pt-4'),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
CarouselItem.displayName = 'CarouselItem'
