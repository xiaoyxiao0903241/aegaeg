import { useRef } from 'react'

import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

/**
 * Figma calc `slider` 4462:634 / `handle` 4462:639：
 * track h=6 · fill coral-emphasis · thumb = coral pill + 日数字（非原生 range thumb）。
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
    <div className="relative h-[21px] w-full">
      <div
        aria-label={ariaLabel}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={value}
        className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 cursor-pointer rounded-[3px] bg-[#f5f6f8]"
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
          className="absolute top-0 left-0 h-full rounded-[3px] bg-coral-emphasis"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* handle leaf — pill with day label */}
      <div
        className={cn(
          'pointer-events-none absolute top-[2px] flex -translate-x-1/2 items-center justify-center',
          'rounded-full border-[1.5px] border-coral-emphasis bg-coral-emphasis px-3 py-[3px]',
        )}
        style={{ left: `${pct}%` }}
      >
        <Text
          as="span"
          className="text-[12px] leading-none font-medium text-[#eceef2]"
          variant="caption"
        >
          {value}
        </Text>
      </div>
    </div>
  )
}
