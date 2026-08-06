import { type ReactNode } from 'react'

import { BOND_PERIODS, type BondPeriod } from '~/core/staking/staking-period'
import { Card } from '~/shared/components/card'
import { chipVariants } from '~/shared/components/chip'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 债券周期选项卡（组合式）
 *
 * 左：单选点 + 周期名 + 收益率徽标 + 折扣区间 / 已售；
 * 右：当前折扣与折扣价。
 */

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
        selected && 'border-coral-emphasis bg-accent',
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

/** 折扣区间为产品固定档位，非市场演示数字。 */
export const BOND_DISCOUNT_RANGES: Record<BondPeriod, string> = {
  '180': '85% – 100%',
  '360': '80% – 100%',
  '540': '75% – 100%',
}

type BondPeriodCardCopy = {
  yield: string
  discountRange: string
  sold: string
  currentDiscount: string
  discountPrice: string
}

/**
 * 债券周期单选列表
 *
 * 选中态仅改边框与底色，收益率以成功色徽标展示；
 * 折扣价缺失时显示 $0.00。
 */
export function BondPeriodList({
  ariaLabel,
  periodLabel,
  value,
  onChange,
  periodLabels,
  discounts,
  discountPrices,
  copy,
}: {
  ariaLabel: string
  periodLabel: string
  value: BondPeriod
  onChange: (period: BondPeriod) => void
  periodLabels: Record<BondPeriod, string>
  discounts: Record<BondPeriod, string>
  discountPrices: Record<BondPeriod, string>
  copy: BondPeriodCardCopy
}) {
  return (
    <div className="grid gap-2.5" role="radiogroup" aria-label={ariaLabel}>
      <Text as="span" className="text-foreground/40" variant="copy">
        {periodLabel}
      </Text>
      <div className="grid gap-2.5">
        {BOND_PERIODS.map((period) => {
          const selected = period === value
          const discount = discounts[period] || '0%'
          return (
            <BondPeriodCard key={period} onSelect={() => onChange(period)} selected={selected}>
              <BondPeriodCard.Main>
                <BondPeriodCard.TitleRow
                  periodLabel={periodLabels[period]}
                  selected={selected}
                  yieldLabel={`${copy.yield} 0.00%`}
                />
                <BondPeriodCard.Line>
                  {copy.discountRange} {BOND_DISCOUNT_RANGES[period]}
                </BondPeriodCard.Line>
                <BondPeriodCard.Line>{copy.sold} $0.00</BondPeriodCard.Line>
              </BondPeriodCard.Main>
              <BondPeriodCard.Side
                discount={discount}
                discountLabel={copy.currentDiscount}
                price={discountPrices[period]}
                priceLabel={copy.discountPrice}
              />
            </BondPeriodCard>
          )
        })}
      </div>
    </div>
  )
}
