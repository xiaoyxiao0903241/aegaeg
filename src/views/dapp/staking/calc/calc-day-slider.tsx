import { useRef } from 'react'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * Figma calc `slider` 4462:634 / `handle` 4462:639：
 * track h-1.5（6）· fill coral · handle pill + caption 字（非原生 range thumb）。
 * 尺寸走标准刻度 / token；禁任意 px / hex。
 */
export function CalcDaySlider({
  ariaLabel,
  max = 720,
  min = 1,
  onChange,
  value,
}: {
  ariaLabel: string
  max?: number
  min?: number
  onChange: (day: number) => void
  value: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const span = Math.max(max - min, 1)
  const pct = Math.min(100, Math.max(0, ((value - min) / span) * 100))

  function setFromClientX(clientX: number) {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = rect.width <= 0 ? 0 : (clientX - rect.left) / rect.width
    const next = Math.round(min + Math.min(1, Math.max(0, ratio)) * span)
    onChange(next)
  }

  return (
    <div className="relative h-5 w-full">
      <div
        aria-label={ariaLabel}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={value}
        className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 cursor-pointer rounded-sm bg-background"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault()
            onChange(Math.max(min, value - 1))
          } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault()
            onChange(Math.min(max, value + 1))
          }
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          setFromClientX(event.clientX)
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          setFromClientX(event.clientX)
        }}
        ref={trackRef}
        role="slider"
        tabIndex={0}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-sm bg-coral-emphasis"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={cn(
          'pointer-events-none absolute top-0.5 flex -translate-x-1/2 items-center justify-center',
          'rounded-full border border-coral-emphasis bg-coral-emphasis px-3 py-1',
        )}
        style={{ left: `${pct}%` }}
      >
        <Text as="span" className="leading-none font-medium" tone="inverse" variant="caption">
          {value}
        </Text>
      </div>
    </div>
  )
}
