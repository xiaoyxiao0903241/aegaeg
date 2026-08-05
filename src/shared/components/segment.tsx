import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/** 分段控件滑块的动画时长 / 缓动 */
export const SEGMENT_MOTION_MS = 220
export const SEGMENT_MOTION_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * 轨道高度档位：sm（图表范围）/ md（周期 / 指标）/ lg（闪电 / Turbine 标签）
 */
export type SegmentSize = 'sm' | 'md' | 'lg'

export type SegmentOption = {
  label: string
  value: string
  /** 单项禁用；列表级 `disabled` 优先级更高 */
  disabled?: boolean
}

/** 判断选项是否可被指针 / 键盘激活 */
export function isSegmentOptionEnabled(option: SegmentOption, listDisabled: boolean): boolean {
  return !listDisabled && !option.disabled
}

/** 轨道内边距 / 间距统一用 rem */
const TRACK_PAD_REM = '0.25rem'
const TRACK_GAP_REM = '0.25rem'

/**
 * 等分列的滑块几何（供单元测试）。
 * 实际组件测量激活标签，以轨道宽度百分比定位滑块，缩放安全。
 *
 * @param index 激活选项下标
 * @param count 选项总数
 * @returns 滑块的定位 / 宽度 / 位移样式
 */
export function segmentPillThumbStyle(index: number, count: number): CSSProperties {
  const n = Math.max(1, count)
  const i = Math.min(Math.max(0, index), n - 1)
  return {
    left: TRACK_PAD_REM,
    width: `calc((100% - (${TRACK_PAD_REM} * 2) - (${TRACK_GAP_REM} * ${n - 1})) / ${n})`,
    transform: `translateX(calc(${i} * (100% + ${TRACK_GAP_REM})))`,
    transition: `transform ${SEGMENT_MOTION_MS}ms ${SEGMENT_MOTION_EASING}`,
  }
}

const segmentTrack = tv({
  base: 'relative grid rounded-full bg-secondary',
  variants: {
    size: {
      sm: 'h-6 gap-0.5 p-0.5',
      md: 'h-9 gap-1 p-1',
      lg: 'h-10.5 gap-1 p-1',
    },
    disabled: {
      true: 'pointer-events-none opacity-60',
      false: '',
    },
  },
  defaultVariants: { size: 'md', disabled: false },
})

const segmentThumb = tv({
  base: 'pointer-events-none absolute rounded-full bg-card shadow-[0_1px_2px_rgba(18,26,51,0.06)]',
  variants: {
    size: {
      sm: 'inset-y-0.5',
      md: 'inset-y-1',
      lg: 'inset-y-1',
    },
  },
  defaultVariants: { size: 'md' },
})

const segmentItem = tv({
  base: 'relative z-1 flex items-center justify-center border-0 bg-transparent',
  variants: {
    size: {
      sm: 'min-w-0 px-2.5',
      md: 'min-w-12 px-3',
      lg: 'min-w-12 px-3',
    },
    enabled: {
      true: 'cursor-pointer',
      false: 'cursor-not-allowed opacity-45',
    },
  },
  defaultVariants: { size: 'md', enabled: true },
})

export type SegmentProps = {
  /** 无障碍名称；文案由调用方提供 */
  'aria-label': string
  className?: string
  disabled?: boolean
  onChange: (value: string) => void
  /** 标签文案由调用方 / i18n 提供，本组件不内置领域文案 */
  options: readonly SegmentOption[]
  value: string
  /**
   * 轨道高度档位；调用方按界面场景选择，不设全局统一高度。
   * @default 'md'
   */
  size?: SegmentSize
  /**
   * 激活标签的语义色：coral（珊瑚）/ ink（深色）
   */
  tone?: 'coral' | 'ink'
}

/** 滑块盒：以轨道宽度百分比表示 */
type ThumbBox = { leftPct: number; widthPct: number }

function thumbsEqual(a: ThumbBox, b: ThumbBox): boolean {
  return a.leftPct === b.leftPct && a.widthPct === b.widthPct
}

/**
 * 分段控件 — 白色滑块在轨道内滑动
 *
 * 高度走 `size`；滑块定位以轨道宽度百分比计算。
 */
export function Segment({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  onChange,
  options,
  value,
  size = 'md',
  tone = 'coral',
}: SegmentProps) {
  const count = options.length
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const listRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState<ThumbBox>({ leftPct: 0, widthPct: 0 })
  /** 首次测量前关闭过渡动画，避免闪烁 */
  const [motionReady, setMotionReady] = useState(false)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    function measure() {
      const root = listRef.current
      if (!root) return
      const trackW = root.clientWidth
      if (trackW <= 0) return
      const tabs = root.querySelectorAll<HTMLElement>('[role="tab"]')
      const active = tabs[index]
      if (!active) return
      const next = {
        leftPct: (active.offsetLeft / trackW) * 100,
        widthPct: (active.offsetWidth / trackW) * 100,
      }
      setThumb((prev) => (thumbsEqual(prev, next) ? prev : next))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    for (const tab of list.querySelectorAll('[role="tab"]')) {
      ro.observe(tab)
    }
    return () => ro.disconnect()
  }, [index, options, size])

  // 滑块首次无过渡地绘制完成后才启用滑动动画
  useEffect(() => {
    if (motionReady || thumb.widthPct <= 0) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setMotionReady(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [motionReady, thumb.widthPct])

  return (
    <div
      ref={listRef}
      className={cn(segmentTrack({ size, disabled }), className)}
      data-segment="pill"
      data-segment-size={size}
      data-segment-tone={tone}
      role="tablist"
      aria-label={ariaLabel}
      style={{
        gridTemplateColumns: `repeat(${Math.max(1, count)}, auto)`,
      }}
    >
      {count > 0 ? (
        <div
          aria-hidden
          className={segmentThumb({ size })}
          data-segment-thumb=""
          data-segment-motion={motionReady ? 'ready' : 'settle'}
          style={{
            left: `${thumb.leftPct}%`,
            width: `${thumb.widthPct}%`,
            opacity: thumb.widthPct > 0 ? 1 : 0,
            transition: motionReady
              ? `left ${SEGMENT_MOTION_MS}ms ${SEGMENT_MOTION_EASING}, width ${SEGMENT_MOTION_MS}ms ${SEGMENT_MOTION_EASING}`
              : undefined,
          }}
        />
      ) : null}
      {options.map((option) => {
        const active = option.value === value
        const optionEnabled = isSegmentOptionEnabled(option, disabled)
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={!optionEnabled}
            className={segmentItem({ size, enabled: optionEnabled })}
            onClick={() => {
              if (!optionEnabled) return
              onChange(option.value)
            }}
          >
            <Text
              as="span"
              // lg 标签用 copy 字阶，sm/md 用 support
              variant={size === 'lg' ? 'copy' : 'support'}
              className={cn(
                'whitespace-nowrap',
                active
                  ? tone === 'ink'
                    ? // sm 报价币种常规字重；lg 标签仍加粗
                      size === 'lg'
                      ? 'font-semibold text-foreground'
                      : 'font-normal text-foreground'
                    : 'font-medium text-coral-emphasis'
                  : 'font-medium text-foreground/40',
              )}
            >
              {option.label}
            </Text>
          </button>
        )
      })}
    </div>
  )
}
