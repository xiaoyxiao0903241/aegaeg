import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

/** Figma `seg` sliding-pill motion (issue 05 / ticket 01). */
export const SEGMENT_MOTION_MS = 220
export const SEGMENT_MOTION_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Track height — Tailwind tokens only:
 * - `sm` → `h-6` — chart range `4585:578`
 * - `md` → `h-9` — period / metric `4448:601`（轨高 36）
 * - `lg` → `h-10.5` — flash/turbine tabs `4430:410` / `4435:410`（稿轨高 42）
 */
export type SegmentSize = 'sm' | 'md' | 'lg'

export type SegmentOption = {
  label: string
  value: string
  /** Per-option disable. List-level `disabled` still wins. */
  disabled?: boolean
}

/** Whether a Segment option can receive pointer / keyboard activation. */
export function isSegmentOptionEnabled(option: SegmentOption, listDisabled: boolean): boolean {
  return !listDisabled && !option.disabled
}

/** Tailwind `spacing-1` / `p-1` / `gap-1` — rem, not raw px. */
const TRACK_PAD_REM = '0.25rem'
const TRACK_GAP_REM = '0.25rem'

/**
 * Equal-column thumb geometry (unit tests). Live Segment measures the active tab
 * and places the thumb in **% of track** so zoom / root font-size stay aligned.
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
      /** Figma `seg` 4448:601 — track 36 / pad 4 → pill 28. */
      md: 'h-9 gap-1 p-1',
      /** Figma flash tabs `4430:410` — track 42 / pad 4 → pill 34. */
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
  /** Accessible name — call site supplies i18n. */
  'aria-label': string
  className?: string
  disabled?: boolean
  onChange: (value: string) => void
  /** Labels are call-site / i18n owned — not domain presets inside this primitive. */
  options: readonly SegmentOption[]
  value: string
  /**
   * Track height via Tailwind tokens: `sm`=`h-6` · `md`=`h-9` · `lg`=`h-10.5`.
   * Call site picks per Figma surface — not one global height.
   * @default 'md'
   */
  size?: SegmentSize
  /**
   * Active label tone — Figma variants:
   * - `coral` = `seg` sample `4448:601` (coral + medium)
   * - `ink` = flash/trade tabs `4430:410` (ink + semibold)
   */
  tone?: 'coral' | 'ink'
}

/** Thumb box as % of track width — zoom-safe (no hardcoded px geometry). */
type ThumbBox = { leftPct: number; widthPct: number }

function thumbsEqual(a: ThumbBox, b: ThumbBox): boolean {
  return a.leftPct === b.leftPct && a.widthPct === b.widthPct
}

/**
 * Figma `seg` sliding white pill. Height via {@link SegmentProps.size}
 * (`sm` | `md` | `lg` → `h-6` | `h-9` | `h-10.5`). Gap/pad are Tailwind
 * spacing tokens; thumb left/width are % of the track (not raw px constants).
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
  /** Gate CSS transition so first geometry apply is instant (no flash). */
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

  // Enable slide only after the measured thumb has painted once without transition.
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
              // lg（flash/turbine tabs）稿 13 semibold → copy；sm/md 仍 support 12
              variant={size === 'lg' ? 'copy' : 'support'}
              className={cn(
                'whitespace-nowrap',
                active
                  ? tone === 'ink'
                    ? 'font-semibold text-foreground'
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
