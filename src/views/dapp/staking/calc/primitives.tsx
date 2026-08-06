/**
 * 质押测算页展示组件
 *
 * 提供产品 / 周期 Tab、天数滑杆、结果卡等测算相关展示组件。
 */
import { useRef } from 'react'

import { Card } from '~/shared/components/card'
import { Chip } from '~/shared/components/chip'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { formatNumber } from '~/shared/presenters/format'

function calcUsd(value: number) {
  if (!Number.isFinite(value)) return formatNumber(0, { digits: 2, prefix: '$' })
  return formatNumber(value, { digits: 2, prefix: '$' })
}

function calcPct(value: number) {
  if (!Number.isFinite(value)) return '0.00'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${formatNumber(value, { digits: 2 })}%`
}

/** 产品 / 周期 Tab 行：用 Chip 拼装，不用 Segment 滑动条 */
export function CalcHtabRow({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string
  options: ReadonlyArray<{ label: string; value: string }>
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div aria-label={ariaLabel} className="flex w-full gap-2" role="tablist">
      {options.map((option) => {
        const active = option.value === value
        return (
          <Chip
            aria-selected={active}
            className="min-w-0 flex-1 px-4 font-medium"
            key={option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            shape="pill"
            size="md"
            tone={active ? 'coral' : 'default'}
            variant={active ? 'soft' : 'outlined'}
          >
            {option.label}
          </Chip>
        )
      })}
    </div>
  )
}

/**
 * 测算天数滑杆
 *
 * 自定义滑杆底条与胶囊手柄（非原生 range 控件），
 * 底条填充 coral 色，手柄显示当前天数。
 *
 * @param ariaLabel 滑杆无障碍标签
 * @param max 最大天数，默认 720
 * @param min 最小天数，默认 1
 * @param onChange 天数变化回调
 * @param value 当前天数
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

/**
 * 计算器说明卡
 *
 * 用圆点列表展示测算假设与注意事项。
 */

export function CalcNotesCard({ items }: { items: ReadonlyArray<string> }) {
  return (
    <Card className="grid gap-1.5" surface="elevated">
      <ul className="m-0 grid list-none gap-1.5 p-0">
        {items.map((item) => (
          <li className="flex items-center gap-2.5" key={item}>
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-coral-emphasis" />
            <Text as="p" className="m-0 text-foreground/70" variant="copy">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/**
 * 收益计算器结果卡
 *
 * 展示总收益、收益率徽章、卖出/投入进度条与图例。
 */

type CalcResultCardProps = {
  interestUsd: number
  ratePct: number
  sellUsd: number
  investedUsd: number
  sellShare: number
  investShare: number
  labels: {
    total: string
    rate: string
    sellTotal: string
    invested: string
    yieldBar: string
    legend: {
      released: string
      netYield: string
      cost: string
      grossYield: string
    }
  }
}

export function CalcResultCard({
  interestUsd,
  ratePct,
  sellUsd,
  investedUsd,
  sellShare,
  investShare,
  labels,
}: CalcResultCardProps) {
  return (
    <Card className="grid gap-1.5" surface="elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.total}
          </Text>
          <Text as="strong" className="text-success" variant="stat">
            {calcUsd(interestUsd)}
          </Text>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5">
          <Text as="span" className="text-foreground/40" variant="support">
            {labels.rate}
          </Text>
          <Text as="span" className="font-semibold text-success" variant="copy">
            {calcPct(ratePct)}
          </Text>
        </span>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.sellTotal}
          </Text>
          <Text as="strong" className="font-semibold" variant="detail">
            {calcUsd(sellUsd)}
          </Text>
        </div>
        <div className="flex overflow-hidden rounded-full">
          <span className="bg-accent" style={{ flex: `${100 - sellShare} 0 0` }} />
          <span className="bg-coral-emphasis" style={{ flex: `${sellShare} 0 0` }} />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.invested}
          </Text>
          <Text as="strong" className="font-semibold" variant="detail">
            {calcUsd(investedUsd)}
          </Text>
        </div>
        <div className="flex overflow-hidden rounded-full">
          <span className="bg-border" style={{ flex: `${100 - investShare} 0 0` }} />
          <span
            className="flex items-center justify-center bg-success"
            style={{ flex: `${Math.max(investShare, 18)} 0 0` }}
          >
            <Text as="span" className="font-medium text-primary-foreground" variant="caption">
              {labels.yieldBar.replace('{amount}', calcUsd(interestUsd))}
            </Text>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {(
          [
            ['released', investedUsd, 'bg-accent'],
            ['netYield', interestUsd, 'bg-coral-emphasis'],
            ['cost', investedUsd, 'bg-border'],
            ['grossYield', interestUsd, 'bg-success'],
          ] as const
        ).map(([key, value, dot]) => (
          <div className="flex items-center gap-1.5" key={key}>
            <span aria-hidden className={`size-2 rounded-full ${dot}`} />
            <Text as="span" className="text-foreground/40" variant="support">
              {labels.legend[key]}
            </Text>
            <Text as="strong" className="font-semibold" variant="support">
              {calcUsd(value)}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  )
}
