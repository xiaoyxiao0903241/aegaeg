import { type ElementType, useEffect, useState } from 'react'

import { cn } from '~/shared/lib/utils'

/** Digit reel duration — faster than homepage count-up (home stays 1300ms). */
export const COUNT_DIGIT_MS = 420

/**
 * 指标闪动守卫：空串视为「未知 / 仍在加载」→ 保留上次文案。
 * 已结算零值须显式 `'0'` / `'0.00'` / `≈ $0.00`，禁用 `''`。
 */
export function metricDisplayText(
  next: string,
  retained: string | null,
): { display: string; retain: string | null } {
  if (next.trim() === '') {
    return { display: retained ?? '0', retain: retained }
  }
  return { display: next, retain: next }
}

type ParsedAmount = {
  prefix: string
  raw: string
  suffix: string
}

/** Parse the first numeric token (grouped or plain) from a metric display string. */
export function parseLeadingMetricNumber(text: string): ParsedAmount | null {
  const match = text.match(/^(.*?)([+-]?\d{1,3}(?:,\d{3})*(?:\.\d+)?|[+-]?\d+(?:\.\d+)?)(.*)$/s)
  if (!match) return null
  const [, prefix = '', raw = '', suffix = ''] = match
  return { prefix, raw, suffix }
}

function DigitReel({ digit }: { digit: number }) {
  const safe = Number.isFinite(digit) ? Math.min(9, Math.max(0, Math.trunc(digit))) : 0
  /** Skip mount transition (0→digit); only animate when this column's digit changes. */
  const [canAnimate, setCanAnimate] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setCanAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <span
      aria-hidden
      className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-baseline tabular-nums"
    >
      <span
        className="flex flex-col will-change-transform"
        style={{
          transform: `translateY(-${safe * 10}%)`,
          transitionProperty: 'transform',
          transitionDuration: canAnimate ? `${COUNT_DIGIT_MS}ms` : '0ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="flex h-[1em] items-center justify-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  )
}

/**
 * Per-digit simultaneous reel for metrics / balances.
 * Unchanged digit columns stay still; only changed columns flip.
 * FAQ / static copy: pass `animate={false}`.
 */
export function CountValue({
  text,
  animate = true,
  as: Comp = 'span',
  className,
}: {
  text: string
  animate?: boolean
  as?: ElementType
  className?: string
}) {
  const [retained, setRetained] = useState<string | null>(null)
  const { display, retain } = metricDisplayText(text, retained)
  if (retain !== retained) setRetained(retain)

  const parsed = parseLeadingMetricNumber(display)

  if (!animate || parsed == null) {
    return <Comp className={cn(className)}>{display}</Comp>
  }

  const { prefix, raw, suffix } = parsed
  const chars = raw.split('')

  return (
    <Comp className={cn('inline-flex items-baseline tabular-nums', className)}>
      {prefix ? <span>{prefix}</span> : null}
      <span className="inline-flex items-baseline" aria-label={raw}>
        {chars.map((ch, index) => {
          const fromRight = chars.length - 1 - index
          if (ch >= '0' && ch <= '9') {
            return <DigitReel digit={Number(ch)} key={`d-${fromRight}`} />
          }
          return (
            <span className="inline-block" key={`s-${fromRight}-${ch}`}>
              {ch}
            </span>
          )
        })}
      </span>
      {suffix ? <span>{suffix}</span> : null}
    </Comp>
  )
}
