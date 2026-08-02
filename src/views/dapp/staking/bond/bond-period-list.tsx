import type { BondPeriod } from '~/core/staking/staking-period'
import { cn } from '~/shared/lib/utils'
import { chipVariants } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'

const PERIODS: BondPeriod[] = ['180', '360', '540']

/** FAQ / product invariant discount bands — not market demo numbers. */
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
 * Figma `bond` 4454:602 / yield chip `gb` 4454:607.
 * Yield chrome → Chip soft success（禁页袋手搓 h/hex）.
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
  /** Spot × discount% → `$59.80`; missing → `$0.00`. */
  discountPrices: Record<BondPeriod, string>
  copy: BondPeriodCardCopy
}) {
  return (
    <div className="grid gap-2.5" role="radiogroup" aria-label={ariaLabel}>
      <Text as="span" className="text-foreground/40" variant="copy">
        {periodLabel}
      </Text>
      <div className="grid gap-2.5">
        {PERIODS.map((period) => {
          const selected = period === value
          const discount = discounts[period] || '0%'
          return (
            <button
              aria-checked={selected}
              className={cn(
                // Figma bond `4454:602`：p-3 + 左栏 gap-2（稿 8）合成卡高（禁 h-[91px]）
                'flex w-full items-start justify-between gap-3 rounded-md border p-3 text-left transition-colors',
                selected ? 'border-coral-emphasis bg-primary-soft' : 'border-border bg-card',
              )}
              key={period}
              onClick={() => onChange(period)}
              role="radio"
              type="button"
            >
              <div className="grid min-w-0 flex-1 gap-2">
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
                    {periodLabels[period]}
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
                    {/* 周期收益率：无源 → 诚实 0（gaps §3.3） */}
                    {copy.yield} 0.00%
                  </span>
                </div>
                <Text as="span" className="text-foreground/40" variant="support">
                  {copy.discountRange} {BOND_DISCOUNT_RANGES[period]}
                </Text>
                {/* 已售：无源 → 诚实 $0.00（gaps §3.3） */}
                <Text as="span" className="text-foreground/40" variant="support">
                  {copy.sold} $0.00
                </Text>
              </div>
              <div className="grid shrink-0 gap-1 text-right">
                <Text as="span" className="text-foreground/40" variant="support">
                  {copy.currentDiscount}
                </Text>
                <Text as="strong" className="font-semibold text-coral-emphasis" variant="headline">
                  {discount.endsWith('%') ? discount : `${discount}%`}
                </Text>
                <Text as="span" className="text-foreground/40" variant="support">
                  {copy.discountPrice} {discountPrices[period]}
                </Text>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
