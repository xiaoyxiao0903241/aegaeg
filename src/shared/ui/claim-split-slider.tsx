import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

export type ClaimSplitSliderProps = {
  /** Accessible name — call site supplies i18n. */
  'aria-label': string
  className?: string
  disabled?: boolean
  onChange: (releasePct: number) => void
  /** Share sent to the release pool (0–100). Restake = 100 − value. */
  value: number
}

/** UI-only 0–100 clamp — domain SSOT remains `claimSplitFromReleasePct` in core. */
function clampSliderPct(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)))
}

/**
 * Dual-tone claim split chrome — Figma `4812:221`.
 * Coral track = release; blue = restake; white thumb embeds `%`.
 * Labels / aria / split math are call-site owned (`claimSplitFromReleasePct`).
 */
export function ClaimSplitSlider({
  'aria-label': ariaLabel,
  className,
  disabled = false,
  onChange,
  value,
}: ClaimSplitSliderProps) {
  const releasePct = clampSliderPct(value)

  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex h-7 w-full max-w-108 touch-none items-center select-none',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      data-claim-split-slider=""
      value={[releasePct]}
      max={100}
      step={1}
      disabled={disabled}
      onValueChange={(next) => onChange(next[0] ?? 0)}
      aria-label={ariaLabel}
    >
      <SliderPrimitive.Track className="relative h-2 w-full overflow-hidden rounded-full">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 bg-primary"
          style={{ width: `${releasePct}%` }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 bg-(--app-claim-restake)"
          style={{ width: `${100 - releasePct}%` }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          'flex h-6.5 min-w-13 cursor-grab items-center justify-center rounded-full',
          'border border-border bg-card px-3 py-1 shadow-sm',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'active:cursor-grabbing',
        )}
        asChild
      >
        <div>
          <Text as="span" variant="support" className="font-semibold text-foreground">
            {releasePct}%
          </Text>
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
}
