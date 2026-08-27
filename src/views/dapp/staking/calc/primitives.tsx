/**
 * 质押测算页展示组件
 *
 * 提供产品 / 周期 Tab、天数滑杆、结果卡等测算相关展示组件。
 */
import * as SliderPrimitive from '@radix-ui/react-slider'

import { CALC_MAX_DAYS } from '~/core/staking/staking-yield'
import { interpolate } from '~/i18n/interpolate'
import { Card } from '~/shared/components/card'
import { Chip } from '~/shared/components/chip'
import { Skeleton } from '~/shared/components/skeleton'
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
 * @param max 最大天数，默认 CALC_MAX_DAYS
 * @param min 最小天数，默认 1
 * @param onChange 天数变化回调
 * @param value 当前天数
 */
export function CalcDaySlider({
  ariaLabel,
  max = CALC_MAX_DAYS,
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
          <li className="flex items-start gap-2.5" key={item}>
            {/* 行高等高盒子：圆点跟首行对齐，不跟整段居中 */}
            <span
              aria-hidden
              className="inline-flex h-[1lh] shrink-0 items-center text-(length:--type-copy-size) leading-(--type-copy-leading)"
            >
              <span className="size-1.5 rounded-full bg-coral-emphasis" />
            </span>
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
  profitUsd: number
  ratePct: number
  sellUsd: number
  investedUsd: number
  releasedUsd: number
  rewardsUsd: number
  labels: {
    total: string
    rate: string
    sellTotal: string
    invested: string
    yieldBar: string
    lossBar: string
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
  profitUsd,
  ratePct,
  sellUsd,
  investedUsd,
  releasedUsd,
  rewardsUsd,
  labels,
  netYieldHint,
}: CalcResultCardProps) {
  const profitable = profitUsd >= 0
  const sellBase = sellUsd > 0 ? sellUsd : 0
  // 上条：净收益占卖出总值；下条：收益总额叠在 max(卖出, 投入) 上
  const releasedShare = sellBase > 0 ? (releasedUsd / sellBase) * 100 : 0
  const rewardsShare = sellBase > 0 ? (rewardsUsd / sellBase) * 100 : 0
  const full = Math.max(sellUsd, investedUsd, 0)
  const costShare = full > 0 ? (investedUsd / full) * 100 : 0
  const markShare = full > 0 ? (Math.min(sellUsd, investedUsd) / full) * 100 : 0
  const overlayShare = Math.max(0, 100 - markShare)
  const releasedTip = `${labels.legend.released} ${calcUsd(releasedUsd)}`
  const rewardsTip = `${labels.legend.netYield} ${calcUsd(rewardsUsd)}`
  const costTip = `${labels.legend.cost} ${calcUsd(investedUsd)}`
  const profitTip = profitable
    ? `${labels.legend.grossYield} ${calcUsd(profitUsd)}`
    : interpolate(labels.lossBar, { amount: calcUsd(Math.abs(profitUsd)) })

  return (
    <Card className="grid gap-1.5" surface="elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.total}
          </Text>
          <Text
            as="strong"
            className={profitable ? 'text-success' : 'text-destructive'}
            variant="stat"
          >
            {calcUsd(profitUsd)}
          </Text>
        </div>
        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${
            profitable ? 'bg-success-soft' : 'bg-destructive/10'
          }`}
        >
          <Text as="span" className="text-foreground/40" variant="support">
            {labels.rate}
          </Text>
          <Text
            as="span"
            className={`font-semibold ${profitable ? 'text-success' : 'text-destructive'}`}
            variant="copy"
          >
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
        <div className="flex h-3.5 overflow-hidden rounded-full bg-border">
          {releasedShare > 0 ? (
            <Tooltip content={releasedTip}>
              <span
                className="h-full shrink-0 cursor-help bg-accent"
                style={{ width: `${releasedShare}%` }}
              />
            </Tooltip>
          ) : null}
          {rewardsShare > 0 ? (
            <Tooltip content={rewardsTip}>
              <span
                className="h-full shrink-0 cursor-help bg-coral-emphasis"
                style={{ width: `${rewardsShare}%` }}
              />
            </Tooltip>
          ) : null}
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
        <div className="relative flex h-3.5 overflow-hidden rounded-full bg-border">
          {costShare > 0 ? (
            <Tooltip content={costTip}>
              <span
                className="h-full shrink-0 cursor-help bg-border"
                style={{ width: `${costShare}%` }}
              />
            </Tooltip>
          ) : null}
          {overlayShare > 0 ? (
            <Tooltip content={profitTip}>
              <span
                className={`absolute inset-y-0 flex min-w-0 cursor-help items-center overflow-hidden pl-2 ${
                  profitable ? 'bg-success' : 'bg-destructive/80'
                }`}
                style={{ left: `${markShare}%`, width: `${overlayShare}%` }}
              >
                <Text
                  as="span"
                  className="font-medium whitespace-nowrap text-primary-foreground"
                  variant="caption"
                >
                  {interpolate(profitable ? labels.yieldBar : labels.lossBar, {
                    amount: calcUsd(Math.abs(profitUsd)),
                  })}
                </Text>
              </span>
            </Tooltip>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {(
          [
            ['released', releasedUsd, 'bg-accent'],
            ['netYield', rewardsUsd, 'bg-coral-emphasis'],
            ['cost', investedUsd, 'bg-border'],
            ['grossYield', profitUsd, profitable ? 'bg-success' : 'bg-destructive'],
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

/** 结果卡骨架：标签与真卡同槽，金额与进度条占位。 */
export function CalcResultCardSkeleton({
  labels,
  netYieldHint,
}: {
  labels: CalcResultCardProps['labels']
  netYieldHint: string
}) {
  const legendKeys = ['released', 'netYield', 'cost', 'grossYield'] as const
  return (
    <Card aria-busy="true" className="grid gap-1.5" surface="elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.total}
          </Text>
          <Skeleton className="h-8 w-36" />
        </div>
        <span className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
          <Text as="span" className="text-foreground/40" variant="support">
            {labels.rate}
          </Text>
          <Skeleton className="h-4 w-14" />
        </span>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.sellTotal}
          </Text>
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-3.5 w-full rounded-full" />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.invested}
          </Text>
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-3.5 w-full rounded-full" />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {legendKeys.map((key) => (
          <div className="flex items-center gap-1.5" key={key}>
            <Skeleton className="size-2 rounded-full" />
            <Text as="span" className="text-foreground/40" variant="support">
              {labels.legend[key]}
            </Text>
            <Skeleton className="h-3.5 w-14" />
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
