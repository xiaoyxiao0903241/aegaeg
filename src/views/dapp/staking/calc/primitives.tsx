/**
 * 质押测算页展示组件
 *
 * 提供产品 / 周期 Tab、天数滑杆、结果卡等测算相关展示组件。
 */
import * as SliderPrimitive from '@radix-ui/react-slider'

import { interpolate } from '~/i18n/interpolate'
import { Card } from '~/shared/components/card'
import { Chip } from '~/shared/components/chip'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
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
export function CalcHtabRow<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string
  options: ReadonlyArray<{ label: string; value: T }>
  value: T
  onChange: (next: T) => void
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
 * 与领取分配滑杆同走 Radix：整轨可点、手柄可拖、`touch-none` 防 H5 竖滚抢手势。
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
  const clamped = Math.min(max, Math.max(min, Math.round(value)))

  return (
    <SliderPrimitive.Root
      aria-label={ariaLabel}
      className="relative flex h-7 w-full touch-none items-center select-none"
      max={max}
      min={min}
      onValueChange={(next) => onChange(next[0] ?? min)}
      step={1}
      value={[clamped]}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-sm bg-background">
        <SliderPrimitive.Range className="absolute h-full bg-coral-emphasis" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        asChild
        className={cn(
          'flex h-5.25 min-w-11.25 cursor-grab items-center justify-center rounded-full',
          'border border-coral-emphasis bg-coral-emphasis px-3 py-1',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'active:cursor-grabbing',
        )}
      >
        <div>
          <Text as="span" className="leading-none font-medium" tone="inverse" variant="caption">
            {clamped}
          </Text>
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
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
  netYieldHint: string
}

export function CalcResultCard({
  interestUsd,
  ratePct,
  sellUsd,
  investedUsd,
  sellShare,
  investShare,
  labels,
  netYieldHint,
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
        {/* 轨高对齐 Figma rcard bar 14px；空段无字时也必须有高，否则塌成 0 */}
        <div className="flex h-3.5 overflow-hidden rounded-full">
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
        <div className="flex h-3.5 overflow-hidden rounded-full">
          {/*
            绿段 flex 与灰段互补（合计 100）；有收益时绿段至少 18，避免 H5 文案折行。
            文案 nowrap + 段内 overflow-hidden：过窄时裁切，不换行撑高。
          */}
          <span
            className="min-w-0 bg-border"
            style={{
              flex: `${interestUsd > 0 ? 100 - Math.max(investShare, 18) : 100} 0 0`,
            }}
          />
          <span
            className="flex min-w-0 items-center overflow-hidden bg-success pl-2"
            style={{
              flex: `${interestUsd > 0 ? Math.max(investShare, 18) : 0} 0 0`,
            }}
          >
            <Text
              as="span"
              className="font-medium whitespace-nowrap text-primary-foreground"
              variant="caption"
            >
              {interpolate(labels.yieldBar, { amount: calcUsd(interestUsd) })}
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
            {key === 'netYield' ? (
              <Tooltip.Info
                className="size-3 text-foreground [&_svg]:size-3"
                content={netYieldHint}
              />
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  )
}
