import type { CSSProperties } from 'react'
import { Chip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/** Figma `seg` sliding-pill motion (issue 05 / ticket 01). */
export const SEGMENT_MOTION_MS = 220
export const SEGMENT_MOTION_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
export const SEGMENT_PILL_GAP_PX = 4
export const SEGMENT_PILL_PAD_PX = 4

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

/**
 * Sliding white pill geometry + transform transition.
 * `100%` inside `translateX` refers to the thumb width.
 */
export function segmentPillThumbStyle(index: number, count: number): CSSProperties {
  const n = Math.max(1, count)
  const i = Math.min(Math.max(0, index), n - 1)
  const gapTotal = SEGMENT_PILL_GAP_PX * (n - 1)
  return {
    left: `${SEGMENT_PILL_PAD_PX}px`,
    width: `calc((100% - ${SEGMENT_PILL_PAD_PX * 2}px - ${gapTotal}px) / ${n})`,
    transform: `translateX(calc(${i} * (100% + ${SEGMENT_PILL_GAP_PX}px)))`,
    transition: `transform ${SEGMENT_MOTION_MS}ms ${SEGMENT_MOTION_EASING}`,
  }
}

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
   * Active label tone — Figma variants:
   * - `coral` = `seg` sample `4448:601` (coral + medium)
   * - `ink` = flash/trade tabs `4430:410` (ink + semibold)
   */
  tone?: 'coral' | 'ink'
}

/**
 * Figma `seg` sliding white pill. Active label tone is call-site owned
 * (`coral` vs `ink` — see {@link SegmentProps.tone}).
 * Options + copy come from the call site (i18n). Not a Chip grid —
 * use {@link PercentButtonRow} for amount % chips.
 */
export function Segment({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  onChange,
  options,
  value,
  tone = 'coral',
}: SegmentProps) {
  const count = options.length
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  return (
    <div
      className={cn(
        'relative grid gap-1 rounded-full bg-secondary p-1',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      data-segment="pill"
      data-segment-tone={tone}
      role="tablist"
      aria-label={ariaLabel}
      style={{
        gridTemplateColumns: `repeat(${Math.max(1, count)}, minmax(0, 1fr))`,
      }}
    >
      {count > 0 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-card shadow-sm"
          data-segment-thumb=""
          style={segmentPillThumbStyle(index, count)}
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
            className={cn(
              'relative z-1 flex min-h-7 items-center justify-center border-0 bg-transparent px-1 py-2',
              optionEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-45',
            )}
            onClick={() => {
              if (!optionEnabled) return
              onChange(option.value)
            }}
          >
            <Text
              as="span"
              variant="support"
              className={cn(
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

/**
 * Composite：Swap 专用百分比按钮（25/50/75/100）— Chip 网格，≠ Segment=A 合同。
 */
export type PercentButtonRowProps = {
  'aria-label': string
  className?: string
  disabled?: boolean
  onSelect: (percent: number) => void
  values?: number[]
}

export function PercentButtonRow({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  onSelect,
  values = [25, 50, 75, 100],
}: PercentButtonRowProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-1.5', className)} role="group" aria-label={ariaLabel}>
      {values.map((percent) => (
        <Chip
          key={percent}
          disabled={disabled}
          onClick={() => onSelect(percent)}
          shape="rounded"
          size="md"
          type="button"
          variant="outlined"
          tone="default"
        >
          {percent}%
        </Chip>
      ))}
    </div>
  )
}
