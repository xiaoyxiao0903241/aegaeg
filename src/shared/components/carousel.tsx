import type { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
import { tv } from 'tailwind-variants'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { iconVariants } from '~/shared/components/icon'
import { cn } from '~/shared/lib/utils'

/**
 * DApp 轮播
 *
 * 组合组件：`Carousel` · `Content` · `Item` · `Indicators`。
 * Embla 全部封装在内，调用方不接触其 API；`peek` 形态自带两侧渐隐。
 * @see docs/foundation/component-usage.md
 */

type SlideChrome = 'about' | 'peek'

type CarouselContextValue = {
  carouselRef: (instance: HTMLElement | null) => void
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  snapCount: number
}

const CarouselContext = createContext<CarouselContextValue | null>(null)
const SlideChromeContext = createContext<SlideChrome>('about')

function useCarousel() {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return context
}

const carouselChrome = tv({
  slots: {
    root: 'grid w-full overflow-visible',
    viewport: '',
    track: '-ml-8 flex items-stretch',
    slide: 'flex w-full max-w-full min-w-0 shrink-0 grow-0 basis-full flex-col pl-8',
    /** peek（季卡）外围容器 */
    peekBleed: 'relative -mx-5 w-[calc(100%+2.5rem)] min-w-0 overflow-visible px-5',
    peekViewport: 'w-full min-w-0 overflow-x-hidden overflow-y-visible',
    peekTrack: '-ml-2.5 flex items-stretch',
    peekSlide: 'min-w-0 shrink-0 grow-0 basis-auto pl-2.5',
    fade: 'pointer-events-none absolute inset-y-0 z-1 w-5 from-card to-transparent transition-opacity duration-200',
    indicatorBar: 'inline-flex items-center justify-center self-center',
    navButton:
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-muted-foreground',
    chevron: 'block',
    dotGroup: 'inline-flex items-center gap-1.5',
    dotButton: [
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0',
      iconVariants({ size: 'base' }),
    ],
    // 选中点高度固定，仅改宽度会塌成一条线
    dot: 'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
  },
  variants: {
    layout: {
      desktop: {
        root: 'gap-0',
        // 多列滑页 min-content 会顶穿 calc(100%+出血)，须允许收缩并裁切
        viewport:
          'min-w-0 overflow-x-hidden dapp:-mx-6 dapp:w-[calc(100%+3rem)] dapp:px-6 dapp:pb-(--shadow-bleed-subtle)',
        indicatorBar: [
          'gap-3.5',
          'relative z-1 -mt-(--shadow-bleed-subtle) pt-(--carousel-pc-indicator-pt)',
        ],
        navButton: iconVariants({ size: 'base' }),
        chevron: iconVariants({ size: 'base' }),
      },
      mobile: {
        viewport: [
          'min-w-0 overflow-x-hidden',
          '-mx-(--shadow-bleed-h5) w-[calc(100%+2*var(--shadow-bleed-h5))]',
          'px-(--shadow-bleed-h5) pt-(--carousel-h5-viewport-pad-y) pb-(--shadow-bleed-subtle)',
        ].join(' '),
        indicatorBar: [
          'gap-2.5',
          'relative z-1 -mt-[calc(var(--shadow-bleed-subtle)-var(--carousel-h5-viewport-pad-y))]',
          'pt-(--carousel-h5-indicator-pt)',
        ].join(' '),
        navButton: [
          'size-(--dapp-icon-lg) rounded-full',
          'duration-dapp-fast transition-[background-color,color] ease-out',
          'hover:bg-background hover:text-muted-foreground',
        ].join(' '),
        chevron: iconVariants({ size: 'md' }),
      },
    },
    fadeSide: {
      left: { fade: 'left-0 bg-linear-to-r' },
      right: { fade: 'right-0 bg-linear-to-l' },
    },
    fadeVisible: {
      true: { fade: 'opacity-100' },
      false: { fade: 'opacity-0' },
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

type CarouselRootProps = HTMLAttributes<HTMLDivElement> & {
  /** 轮播选项（loop / align / startIndex 等）；Embla 内部实现，调用方无需关心 */
  opts?: EmblaOptionsType
  /**
   * 自动播放间隔（ms）。仅桌面生效，移动端不播放；
   * 调用方无需自行引入自动播放插件。
   */
  autoplayMs?: number
  /** 外部索引变化时静默对齐（如创世当前季）；无有效索引时不传 */
  syncIndex?: number
  children?: ReactNode
}

/** 轮播根组件：管理 Embla 实例、自动播放、索引同步与键盘翻页 */
function CarouselRoot({
  opts,
  autoplayMs,
  syncIndex,
  className,
  children,
  ...props
}: CarouselRootProps) {
  const isMobile = useMobileViewport()
  const layout = isMobile ? 'mobile' : 'desktop'

  const plugins = useMemo(() => {
    if (autoplayMs == null || isMobile) return undefined
    return [
      Autoplay({
        delay: autoplayMs,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ]
  }, [autoplayMs, isMobile])

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: 'x',
      watchDrag: (emblaApi, event) => {
        if (emblaApi.scrollSnapList().length <= 1) return false
        const passed = opts?.watchDrag
        if (typeof passed === 'function') return passed(emblaApi, event)
        return passed !== false
      },
    },
    plugins,
  )
  const viewportNodeRef = useRef<HTMLElement | null>(null)
  const syncedIndexRef = useRef<number | null>(null)
  const setViewportRef = useCallback(
    (node: HTMLElement | null) => {
      viewportNodeRef.current = node
      carouselRef(node)
    },
    [carouselRef],
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(opts?.startIndex ?? 0)
  const [snapCount, setSnapCount] = useState(0)

  const onSelect = useCallback((instance: NonNullable<typeof api>) => {
    setCanScrollPrev(instance.canScrollPrev())
    setCanScrollNext(instance.canScrollNext())
    setSelectedIndex(instance.selectedScrollSnap())
    setSnapCount(instance.scrollSnapList().length)
  }, [])

  // api 就绪时在 render 期同步一次导航态，避免 effect 里同步 setState。
  const [prevApi, setPrevApi] = useState(api)
  if (api !== prevApi) {
    setPrevApi(api)
    if (api) onSelect(api)
  }

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])
  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])
  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (snapCount <= 1) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext, snapCount],
  )

  useEffect(() => {
    if (!api) return
    const syncAutoplay = (instance: NonNullable<typeof api>) => {
      const autoplay = instance.plugins()?.autoplay
      if (!autoplay) return
      if (instance.scrollSnapList().length <= 1) autoplay.stop()
    }
    const onInit = (instance: NonNullable<typeof api>) => {
      onSelect(instance)
      syncAutoplay(instance)
    }
    api.on('init', onInit)
    api.on('reInit', onInit)
    api.on('select', onSelect)
    return () => {
      api.off('init', onInit)
      api.off('reInit', onInit)
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  useEffect(() => {
    if (!api || syncIndex == null || syncIndex < 0) return
    if (syncedIndexRef.current === syncIndex) return
    api.scrollTo(syncIndex, false)
    syncedIndexRef.current = syncIndex
  }, [api, syncIndex])

  useEffect(() => {
    if (!api) return
    const node = viewportNodeRef.current
    if (!node) return

    let lastWidth = node.getBoundingClientRect().width
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      const becameVisible = lastWidth === 0 && width > 0
      const resizedWhileVisible = width > 0 && lastWidth > 0 && Math.abs(width - lastWidth) > 1
      if (becameVisible || resizedWhileVisible) api.reInit()
      lastWidth = width
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [api])

  const contextValue = useMemo(
    () => ({
      carouselRef: setViewportRef,
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev,
      canScrollNext,
      selectedIndex,
      snapCount,
    }),
    [
      setViewportRef,
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev,
      canScrollNext,
      selectedIndex,
      snapCount,
    ],
  )

  const chrome = carouselChrome({ layout })

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        className={cn(chrome.root(), 'relative', className)}
        onKeyDownCapture={handleKeyDown}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

type ContentProps = HTMLAttributes<HTMLDivElement> & {
  /** `about` = 全幅卡片；`peek` = 多卡窥视形态（创世季），自带两侧渐隐 */
  chrome?: SlideChrome
}

/**
 * 轮播滚动区
 *
 * `chrome="peek"` 时为多卡窥视形态，自带两侧渐隐边。
 */
const Content = forwardRef<HTMLDivElement, ContentProps>(function CarouselContent(
  { className, chrome = 'about', children, ...props },
  ref,
) {
  const { carouselRef, canScrollNext, canScrollPrev } = useCarousel()
  const isMobile = useMobileViewport()
  const layout = isMobile ? 'mobile' : 'desktop'
  const styles = carouselChrome({ layout })

  const track = (
    <div
      ref={ref}
      className={cn(chrome === 'peek' ? styles.peekTrack() : styles.track(), className)}
      {...props}
    >
      {children}
    </div>
  )

  return (
    <SlideChromeContext.Provider value={chrome}>
      {chrome === 'peek' ? (
        <div className={styles.peekBleed()}>
          <div ref={carouselRef} className={styles.peekViewport()}>
            {track}
          </div>
          <div
            aria-hidden
            className={carouselChrome({ fadeSide: 'left', fadeVisible: canScrollPrev }).fade()}
          />
          <div
            aria-hidden
            className={carouselChrome({ fadeSide: 'right', fadeVisible: canScrollNext }).fade()}
          />
        </div>
      ) : (
        <div ref={carouselRef} className={styles.viewport()}>
          {track}
        </div>
      )}
    </SlideChromeContext.Provider>
  )
})

type ItemProps = HTMLAttributes<HTMLDivElement> & {
  /** 传入后由轮播管理 `aria-hidden`，调用方无需读取当前索引 */
  index?: number
}

/**
 * 轮播项
 *
 * 传入 `index` 时，非当前项自动设置 `aria-hidden`。
 */
const Item = forwardRef<HTMLDivElement, ItemProps>(function CarouselItem(
  { className, index, children, ...props },
  ref,
) {
  const { selectedIndex } = useCarousel()
  const slideChrome = useContext(SlideChromeContext)
  const styles = carouselChrome()
  const active = index === undefined || index === selectedIndex

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-hidden={index === undefined ? undefined : !active}
      className={cn(slideChrome === 'about' ? styles.slide() : styles.peekSlide(), className)}
      {...props}
    >
      {children}
    </div>
  )
})

type IndicatorsProps = {
  className?: string
  /** `about` = 常规间距；`plain` = 紧凑控件组（peek 季卡底栏） */
  chrome?: 'about' | 'plain'
  dotLabel?: (index: number) => string
  nextLabel: string
  prevLabel: string
}

/**
 * 轮播指示器
 *
 * 上一页 / 下一页按钮加圆点；仅一个时整组不渲染。
 */
function Indicators({
  className,
  chrome = 'about',
  dotLabel,
  nextLabel,
  prevLabel,
}: IndicatorsProps) {
  const { scrollNext, scrollPrev, scrollTo, selectedIndex, snapCount } = useCarousel()
  const isMobile = useMobileViewport()
  // plain 始终用紧凑桌面档；about 跟随视口布局
  const layout = chrome === 'plain' ? 'desktop' : isMobile ? 'mobile' : 'desktop'
  const styles = carouselChrome({ layout })

  if (snapCount <= 1) return null

  return (
    <div
      className={cn(
        chrome === 'about'
          ? styles.indicatorBar()
          : 'inline-flex items-center justify-center gap-3.5 self-center',
        className,
      )}
    >
      <button
        aria-label={prevLabel}
        className={styles.navButton()}
        onClick={scrollPrev}
        type="button"
      >
        <ChevronLeft aria-hidden className={styles.chevron()} strokeWidth={2} />
      </button>
      <div className={styles.dotGroup()} role="group">
        {Array.from({ length: snapCount }, (_, i) => (
          <button
            aria-current={i === selectedIndex ? 'true' : undefined}
            aria-label={dotLabel?.(i) ?? String(i + 1)}
            className={styles.dotButton()}
            key={i}
            onClick={() => scrollTo(i)}
            type="button"
          >
            <span
              aria-hidden
              className={carouselChrome({ layout, dotActive: i === selectedIndex }).dot()}
            />
          </button>
        ))}
      </div>
      <button
        aria-label={nextLabel}
        className={styles.navButton()}
        onClick={scrollNext}
        type="button"
      >
        <ChevronRight aria-hidden className={styles.chevron()} strokeWidth={2} />
      </button>
    </div>
  )
}

export const Carousel = Object.assign(CarouselRoot, {
  Content,
  Item,
  Indicators,
})

/** 轮播 / 引导进度点共用（宽高 morph + duration-250）。 */
export function carouselIndicatorDotClass(
  active: boolean,
  layout: 'desktop' | 'mobile' = 'desktop',
): string {
  return carouselChrome({ layout, dotActive: active }).dot()
}
