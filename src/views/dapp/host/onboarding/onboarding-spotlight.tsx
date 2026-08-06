/**
 * 自研新手引导高亮层：紧贴目标 primary 描边 + 全屏遮罩镂空，气泡视口内躲避。
 * 步骤间位移结束后播一次「落点一击」外扩描边（方案 C）；静止态只留实线框。
 * H5 抽屉目标短时 rAF 追位，避免侧拉入场未完时量偏。
 */
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '~/shared/lib/utils'
import { MOBILE_NAV_ENTER_MS } from '~/views/dapp/host/onboarding/onboarding-steps'
import {
  placeOnboardingTooltip,
  type PlaceOnboardingTooltipResult,
  type ViewRect,
} from '~/views/dapp/host/onboarding/place-onboarding-tooltip'

/** 与 `--motion-dapp-emphasis` / 高亮位移 transition 对齐。 */
const HIGHLIGHT_MOVE_MS = 300

function readRect(el: Element): ViewRect {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function isInsideMobileNav(el: Element): boolean {
  return Boolean(el.closest('[data-dapp-mobile-nav]'))
}

type SpotlightLayout = {
  target: ViewRect
  placement: PlaceOnboardingTooltipResult
}

/**
 * @param target 当前步骤锚点；短暂为 null 时保留上一帧布局以便过渡
 * @param children 气泡内容（测量后视口内定位）
 */
export function OnboardingSpotlight({
  target,
  children,
}: {
  target: Element | null
  children: ReactNode
}) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<SpotlightLayout | null>(null)
  const [motionReady, setMotionReady] = useState(false)
  /** 位移落稳后递增，挂载一次 hit 动画 */
  const [hitNonce, setHitNonce] = useState(0)

  useLayoutEffect(() => {
    if (!target) return

    const update = () => {
      const next = readRect(target)
      if (next.width <= 0 || next.height <= 0) return

      const tip = tooltipRef.current
      if (!tip) {
        setLayout({
          target: next,
          placement: { top: 16, left: 16, side: 'right' },
        })
        return
      }
      const tipRect = tip.getBoundingClientRect()
      setLayout({
        target: next,
        placement: placeOnboardingTooltip({
          target: next,
          tooltip: { width: tipRect.width, height: tipRect.height },
          viewport: { width: window.innerWidth, height: window.innerHeight },
        }),
      })
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(target)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)

    let raf = 0
    let stopped = false
    if (isInsideMobileNav(target)) {
      const startedAt = performance.now()
      const track = (now: number) => {
        if (stopped) return
        update()
        if (now - startedAt < MOBILE_NAV_ENTER_MS + 50) {
          raf = window.requestAnimationFrame(track)
        }
      }
      raf = window.requestAnimationFrame(track)
    }

    return () => {
      stopped = true
      ro.disconnect()
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [target])

  useLayoutEffect(() => {
    if (!layout || motionReady) return
    const id = window.requestAnimationFrame(() => setMotionReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [layout, motionReady])

  // 目标切换后：等框位移完再播「落点一击」，避免滑移中看不清
  useEffect(() => {
    if (!target || !layout) return
    const delay = motionReady ? HIGHLIGHT_MOVE_MS : 0
    const timer = window.setTimeout(() => {
      setHitNonce((n) => n + 1)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [target, layout, motionReady])

  const targetRect = target && layout ? layout.target : null
  const placement = target && layout ? layout.placement : null
  const motionClass = motionReady
    ? 'duration-dapp-emphasis transition-[transform,width,height] ease-dapp'
    : undefined

  return createPortal(
    <div aria-modal="true" className="fixed inset-0 z-70" data-onboarding-spotlight role="dialog">
      <div aria-hidden className="absolute inset-0" data-onboarding-block />

      {!targetRect ? <div aria-hidden className="absolute inset-0 bg-black/40" /> : null}

      {targetRect ? (
        <div
          aria-hidden
          className={cn(
            // rounded-md 必须在带 box-shadow 的宿主上，镂空洞口才有圆角
            'pointer-events-none absolute top-0 left-0 overflow-visible rounded-md',
            'will-change-[transform,width,height]',
            motionClass,
          )}
          data-onboarding-highlight
          style={{
            width: targetRect.width,
            height: targetRect.height,
            transform: `translate3d(${targetRect.left}px, ${targetRect.top}px, 0)`,
            boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.4)',
          }}
        >
          <div className="absolute inset-0 rounded-md border-2 border-primary" />
          {hitNonce > 0 ? (
            <div
              className={cn(
                'onboarding-highlight-hit absolute -inset-0.5 rounded-md border-2 border-primary',
                'origin-center will-change-[transform,opacity]',
              )}
              key={hitNonce}
            />
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          'absolute top-0 left-0 z-1 will-change-transform',
          motionReady && 'duration-dapp-emphasis transition-transform ease-dapp',
        )}
        data-onboarding-tooltip-anchor
        ref={tooltipRef}
        style={
          placement
            ? {
                transform: `translate3d(${placement.left}px, ${placement.top}px, 0)`,
              }
            : {
                transform: 'translate3d(16px, 16px, 0)',
                visibility: 'hidden' as const,
              }
        }
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
