import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { SwapContent, SwapWidget } from '~/app/tabs/swap-tab'
import type { DetailPanelControls } from '~/app/types'
import { dappAssets } from '~/app/assets'
import { DappMobileNav } from '~/app/components/dapp-mobile-nav'
import {
  shellMobileDrawerClass,
  shellMobileDrawerSummaryClass,
} from '~/app/shell-layout'
import { useDappShellStore } from '~/stores/dapp-shell-store'

const SCROLL_EDGE_EPSILON_PX = 2
const GESTURE_DEAD_ZONE_PX = 8
const SNAP_RATIO = 0.38
const FLING_VELOCITY_PX_MS = 0.38
const RUBBER_BAND_FACTOR = 0.32
const PAGE_TRANSITION_MS = 380
const PAGE_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

/** 与 shell 同宽；纵向裁切 pager 位移，水平不裁切 */
const pagerViewportClass = 'relative min-h-0 flex-1 w-full overflow-x-visible overflow-y-hidden'

/** 外层滚动：全宽、只负责 scrollTop，不加 padding */
const pagerPageScrollClass =
  'shrink-0 min-w-0 w-full overflow-y-auto overscroll-y-contain'

/**
 * 内层与 scroll 同宽：水平/底部阴影留白；顶部由页面标题 shellMobilePageTitleClass mt-3 承担（Figma 汉堡→标题 12px）。
 */
const pagerPageInnerClass =
  'box-border w-full min-w-0 px-[var(--shadow-bleed-h5)] pb-[var(--shadow-bleed-subtle)]'

type SwapMobilePagerProps = {
  connected: boolean
  detailPanel: DetailPanelControls
  onSelectGenesis: () => void
  windowRef: (node: HTMLDivElement | null) => void
  windowClassName: string
  windowDataset: {
    tab: string
    connected: string
    walletReady: string
    collapsed: string
  }
}

type GestureMode = 'idle' | 'scroll' | 'page'

type GestureSnapshot = {
  mode: GestureMode
  startY: number
  anchorY: number
  anchorOffset: number
  lastY: number
  lastTime: number
  velocityY: number
}

function isAtScrollTop(node: HTMLDivElement) {
  return node.scrollTop <= SCROLL_EDGE_EPSILON_PX
}

function isAtScrollBottom(node: HTMLDivElement) {
  return (
    node.scrollTop + node.clientHeight >=
    node.scrollHeight - SCROLL_EDGE_EPSILON_PX
  )
}

function rubberBandOffset(offset: number, min: number, max: number) {
  if (offset < min) {
    return min - (min - offset) * RUBBER_BAND_FACTOR
  }
  if (offset > max) {
    return max + (offset - max) * RUBBER_BAND_FACTOR
  }
  return offset
}

function resolveSnapTarget(
  offset: number,
  velocityY: number,
  pageHeight: number,
) {
  if (pageHeight <= 0) {
    return 0
  }

  const ratio = offset / pageHeight

  if (velocityY < -FLING_VELOCITY_PX_MS) {
    return pageHeight
  }
  if (velocityY > FLING_VELOCITY_PX_MS) {
    return 0
  }
  if (ratio > 1 - SNAP_RATIO) {
    return pageHeight
  }
  if (ratio < SNAP_RATIO) {
    return 0
  }
  return ratio >= 0.5 ? pageHeight : 0
}

function derivePageIndex(offset: number, pageHeight: number) {
  if (pageHeight <= 0) {
    return 0
  }
  return offset >= pageHeight / 2 ? 1 : 0
}

export function SwapMobilePager({
  connected,
  detailPanel,
  onSelectGenesis,
  windowRef,
  windowClassName,
  windowDataset,
}: SwapMobilePagerProps) {
  const { messages: t } = useI18n()
  const activeTab = useDappShellStore((state) => state.activeTab)
  const mobileNavOpen = useDappShellStore((state) => state.mobileNavOpen)
  const selectMobileTab = useDappShellStore((state) => state.selectMobileTab)
  const setMobileNavOpen = useDappShellStore((state) => state.setMobileNavOpen)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [offsetPx, setOffsetPx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const widgetScrollRef = useRef<HTMLDivElement>(null)
  const contentScrollRef = useRef<HTMLDivElement>(null)
  const gestureRootRef = useRef<HTMLDivElement>(null)
  const gestureRef = useRef<GestureSnapshot | null>(null)
  const offsetPxRef = useRef(0)
  const viewportHeightRef = useRef(0)
  const mobileNavId = 'dapp-mobile-nav'

  offsetPxRef.current = offsetPx
  viewportHeightRef.current = viewportHeight

  const page = derivePageIndex(offsetPx, viewportHeight)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }

    const syncHeight = () => {
      const nextHeight = Math.round(viewport.clientHeight)
      setViewportHeight((current) => (current === nextHeight ? current : nextHeight))
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (viewportHeight <= 0) {
      return
    }
    setOffsetPx((current) => Math.min(current, viewportHeight))
  }, [viewportHeight])

  useEffect(() => {
    offsetPxRef.current = 0
    setOffsetPx(0)
    setIsDragging(false)
    gestureRef.current = null
    widgetScrollRef.current?.scrollTo({ top: 0 })
    contentScrollRef.current?.scrollTo({ top: 0 })
  }, [activeTab])

  const getScrollNode = useCallback((pageIndex: number) => {
    return pageIndex === 0 ? widgetScrollRef.current : contentScrollRef.current
  }, [])

  const animateToOffset = useCallback((target: number) => {
    setIsDragging(false)
    setOffsetPx(target)
    offsetPxRef.current = target

    if (target <= 0) {
      contentScrollRef.current?.scrollTo({ top: 0 })
    }
    if (target >= viewportHeightRef.current) {
      widgetScrollRef.current?.scrollTo({ top: 0 })
    }
  }, [])

  const handleHintClick = useCallback(() => {
    const pageHeight = viewportHeightRef.current
    if (pageHeight <= 0) {
      return
    }
    const target = offsetPxRef.current >= pageHeight / 2 ? 0 : pageHeight
    animateToOffset(target)
  }, [animateToOffset])

  useEffect(() => {
    const root = gestureRootRef.current
    if (!root || viewportHeight <= 0) {
      return
    }

    const beginGesture = (startY: number) => {
      gestureRef.current = {
        mode: 'idle',
        startY,
        anchorY: startY,
        anchorOffset: offsetPxRef.current,
        lastY: startY,
        lastTime: performance.now(),
        velocityY: 0,
      }
      setIsDragging(true)
    }

    const updateVelocity = (y: number) => {
      const gesture = gestureRef.current
      if (!gesture) {
        return
      }
      const now = performance.now()
      const dt = now - gesture.lastTime
      if (dt > 0) {
        gesture.velocityY = (y - gesture.lastY) / dt
      }
      gesture.lastY = y
      gesture.lastTime = now
    }

    const resolveGestureMode = (y: number) => {
      const gesture = gestureRef.current
      const pageHeight = viewportHeightRef.current
      if (!gesture || pageHeight <= 0) {
        return
      }

      const deltaY = y - gesture.startY
      if (Math.abs(deltaY) < GESTURE_DEAD_ZONE_PX) {
        return
      }

      const pageIndex = derivePageIndex(offsetPxRef.current, pageHeight)
      const scrollNode = getScrollNode(pageIndex)
      if (!scrollNode) {
        return
      }

      const pullingUp = deltaY < 0
      const pullingDown = deltaY > 0
      const atTop = isAtScrollTop(scrollNode)
      const atBottom = isAtScrollBottom(scrollNode)

      if (pageIndex === 0 && pullingUp && atBottom) {
        gesture.mode = 'page'
        gesture.anchorY = y
        gesture.anchorOffset = offsetPxRef.current
        return
      }

      if (pageIndex === 1 && pullingDown && atTop) {
        gesture.mode = 'page'
        gesture.anchorY = y
        gesture.anchorOffset = offsetPxRef.current
        return
      }

      gesture.mode = 'scroll'
    }

    const maybeHandoffToPageDrag = (y: number) => {
      const gesture = gestureRef.current
      const pageHeight = viewportHeightRef.current
      if (!gesture || gesture.mode !== 'scroll' || pageHeight <= 0) {
        return
      }

      const pageIndex = derivePageIndex(offsetPxRef.current, pageHeight)
      const scrollNode = getScrollNode(pageIndex)
      if (!scrollNode) {
        return
      }

      const pullingUp = y < gesture.lastY
      const pullingDown = y > gesture.lastY

      if (pageIndex === 0 && pullingUp && isAtScrollBottom(scrollNode)) {
        gesture.mode = 'page'
        gesture.anchorY = y
        gesture.anchorOffset = offsetPxRef.current
        return
      }

      if (pageIndex === 1 && pullingDown && isAtScrollTop(scrollNode)) {
        gesture.mode = 'page'
        gesture.anchorY = y
        gesture.anchorOffset = offsetPxRef.current
      }
    }

    const applyPageDrag = (y: number) => {
      const gesture = gestureRef.current
      const pageHeight = viewportHeightRef.current
      if (!gesture || pageHeight <= 0) {
        return
      }

      const dragDelta = y - gesture.anchorY
      const nextOffset = rubberBandOffset(
        gesture.anchorOffset - dragDelta,
        0,
        pageHeight,
      )
      offsetPxRef.current = nextOffset
      setOffsetPx(nextOffset)
    }

    const onTouchStart = (event: TouchEvent) => {
      const startY = event.touches[0]?.clientY
      if (startY === undefined) {
        return
      }
      beginGesture(startY)
    }

    const onTouchMove = (event: TouchEvent) => {
      const gesture = gestureRef.current
      if (!gesture) {
        return
      }

      const currentY = event.touches[0]?.clientY
      if (currentY === undefined) {
        return
      }

      if (gesture.mode === 'idle') {
        resolveGestureMode(currentY)
      }

      if (gesture.mode === 'scroll') {
        maybeHandoffToPageDrag(currentY)
      }

      if (gesture.mode === 'page') {
        event.preventDefault()
        applyPageDrag(currentY)
      }

      updateVelocity(currentY)
    }

    const finishGesture = () => {
      const gesture = gestureRef.current
      gestureRef.current = null

      if (!gesture) {
        setIsDragging(false)
        return
      }

      if (gesture.mode === 'page') {
        const pageHeight = viewportHeightRef.current
        const target = resolveSnapTarget(
          offsetPxRef.current,
          gesture.velocityY,
          pageHeight,
        )
        animateToOffset(target)
        return
      }

      setIsDragging(false)
    }

    const onTouchEnd = () => finishGesture()
    const onTouchCancel = () => finishGesture()

    root.addEventListener('touchstart', onTouchStart, { passive: true })
    root.addEventListener('touchmove', onTouchMove, { passive: false })
    root.addEventListener('touchend', onTouchEnd, { passive: true })
    root.addEventListener('touchcancel', onTouchCancel, { passive: true })

    return () => {
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchmove', onTouchMove)
      root.removeEventListener('touchend', onTouchEnd)
      root.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [animateToOffset, getScrollNode, viewportHeight])

  return (
    <div ref={gestureRootRef} className="flex min-h-0 flex-1 flex-col">
      <div
        ref={windowRef}
        className={cn(windowClassName, 'min-h-0 flex-1')}
        data-collapsed={windowDataset.collapsed}
        data-connected={windowDataset.connected}
        data-dapp-window
        data-tab={windowDataset.tab}
        data-wallet-ready={windowDataset.walletReady}
      >
        <div
          className="relative flex min-h-0 flex-1 flex-col overflow-x-visible overflow-y-hidden"
          data-swap-mobile-pager
        >
          <div className={cn(shellMobileDrawerClass, 'px-[var(--shadow-bleed-h5)]')}>
            <button
              aria-controls={mobileNavId}
              aria-expanded={mobileNavOpen}
              aria-label={t.topbar.openMenu}
              className={shellMobileDrawerSummaryClass}
              onClick={() => setMobileNavOpen(true)}
              type="button"
            >
              <img alt="" height="18" src={dappAssets.menu} width="18" />
            </button>
          </div>
          <DappMobileNav
            activeTab={activeTab}
            onClose={() => setMobileNavOpen(false)}
            onSelectTab={selectMobileTab}
            open={mobileNavOpen}
          />

          <div ref={viewportRef} className={pagerViewportClass}>
            {viewportHeight > 0 ? (
              <div
                className="flex flex-col will-change-transform"
                style={{
                  height: viewportHeight * 2,
                  transform: `translate3d(0, ${-offsetPx}px, 0)`,
                  transition: isDragging
                    ? 'none'
                    : `transform ${PAGE_TRANSITION_MS}ms ${PAGE_EASING}`,
                }}
              >
                <div
                  ref={widgetScrollRef}
                  aria-hidden={page !== 0}
                  className={pagerPageScrollClass}
                  style={{ height: viewportHeight }}
                >
                  <div className={pagerPageInnerClass}>
                    <SwapWidget
                      connected={connected}
                      detailPanel={detailPanel}
                      onSelectGenesis={onSelectGenesis}
                      swapPager
                    />
                  </div>
                </div>

                <div
                  ref={contentScrollRef}
                  aria-hidden={page !== 1}
                  className={pagerPageScrollClass}
                  style={{ height: viewportHeight }}
                >
                  <div className={pagerPageInnerClass}>
                    <SwapContent connected={connected} swapPager />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <SwapMobileSwipeHint onClick={handleHintClick} page={page} />
    </div>
  )
}

function SwapMobileSwipeHint({
  onClick,
  page,
}: {
  onClick: () => void
  page: number
}) {
  const { messages: t } = useI18n()
  const isNext = page === 0

  return (
    <div
      className={cn(
        'pointer-events-none relative flex h-[90px] w-[calc(100%+24px)] shrink-0 flex-col items-center justify-end',
        '-mx-3 bg-gradient-to-b from-transparent from-[0%] to-background to-[66.827%] pb-4 pt-9',
      )}
      data-swap-mobile-swipe-hint
    >
      <button
        aria-label={isNext ? t.swap.swipeNext : t.swap.swipePrevious}
        className="pointer-events-auto grid cursor-pointer place-items-center border-0 bg-transparent p-0"
        onClick={onClick}
        type="button"
      >
        <span
          className={cn(
            'grid size-6 place-items-center',
            isNext
              ? '[animation:dapp-swipe-chevron-breathe_2.4s_ease-in-out_infinite]'
              : '[animation:dapp-swipe-chevron-breathe-up_2.4s_ease-in-out_infinite]',
          )}
        >
          <img
            alt=""
            className={cn('size-6', !isNext && 'rotate-180')}
            height="24"
            src={dappAssets.swipeChevronDouble}
            width="24"
          />
        </span>
        <span className="mt-1.5 text-[11px] font-normal leading-normal tracking-[-0.11px] text-ink-strong">
          {isNext ? t.swap.swipeNext : t.swap.swipePrevious}
        </span>
      </button>
    </div>
  )
}
