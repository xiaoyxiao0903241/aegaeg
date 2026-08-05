/**
 * 债券周期选项卡（组合式）
 *
 * 左：单选点 + 周期名 + 收益率徽标 + 折扣区间 / 已售；
 * 右：当前折扣与折扣价。
 */
import { type ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { chipVariants } from '~/shared/components/chip'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

function Root({
  children,
  selected,
  onSelect,
}: {
  children: ReactNode
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Card
      aria-checked={selected}
      as="button"
      className={cn(
        'flex w-full items-start justify-between gap-3 text-left transition-colors',
        selected && 'border-coral-emphasis bg-primary-soft',
      )}
      onClick={onSelect}
      role="radio"
      surface="outlined"
      type="button"
    >
      {children}
    </Card>
  )
}

function Main({ children }: { children: ReactNode }) {
  return <div className="grid min-w-0 flex-1 gap-2">{children}</div>
}

function TitleRow({
  selected,
  periodLabel,
  yieldLabel,
}: {
  selected: boolean
  periodLabel: string
  yieldLabel: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        aria-hidden
        className={cn(
          'relative size-4 shrink-0 rounded-full border',
          selected ? 'border-2 border-coral-emphasis bg-card' : 'border-border',
        )}
      >
        {selected ? (
          <span className="absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-coral-emphasis" />
        ) : null}
      </span>
      <Text as="span" className="font-semibold" variant="detail">
        {periodLabel}
      </Text>
      <span
        className={chipVariants({
          class: 'pointer-events-none h-auto min-h-0 cursor-default px-2 py-0.5',
          shape: 'pill',
          size: 'sm',
          tone: 'success',
          variant: 'soft',
        })}
      >
        {yieldLabel}
      </span>
    </div>
  )
}

function Line({ children }: { children: ReactNode }) {
  return (
    <Text as="span" className="text-foreground/40" variant="support">
      {children}
    </Text>
  )
}

function Side({
  discountLabel,
  discount,
  priceLabel,
  price,
}: {
  discountLabel: string
  discount: string
  priceLabel: string
  price: string
}) {
  const discountText = discount.endsWith('%') ? discount : `${discount}%`
  return (
    <div className="grid shrink-0 gap-1 text-right">
      <Text as="span" className="text-foreground/40" variant="support">
        {discountLabel}
      </Text>
      <Text as="strong" className="font-semibold text-coral-emphasis" variant="headline">
        {discountText}
      </Text>
      <Text as="span" className="text-foreground/40" variant="support">
        {priceLabel} {price}
      </Text>
    </div>
  )
}

export const BondPeriodCard = Object.assign(Root, {
  Main,
  TitleRow,
  Line,
  Side,
})
