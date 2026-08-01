import type { BondPeriod } from '~/core/staking/staking-period'
import { cn } from '~/shared/lib/utils'
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
 * Figma `bond` 4454:602 / yield chip `gb` 4454:607:
 * chip h=17 = py 2 + text linebox 13 (11px) + py 2; radius 10; functional/up #33d07a.
 * Selected: coral-soft #fceae2 (=primary-soft) · border 1.4 coral-emphasis #e9785a.
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
      <Text as="span" className="text-[13px] text-foreground/40" variant="copy">
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
                'flex w-full items-start justify-between gap-3 rounded-md p-3.5 text-left transition-colors',
                selected
                  ? 'border-[1.4px] border-coral-emphasis bg-primary-soft'
                  : 'border border-border bg-card',
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
                      'relative size-4 shrink-0 rounded-full',
                      selected
                        ? 'border-2 border-coral-emphasis bg-card'
                        : 'border-[1.5px] border-border',
                    )}
                  >
                    {selected ? (
                      <span className="absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-coral-emphasis" />
                    ) : null}
                  </span>
                  <Text as="span" className="text-[14px] font-semibold" variant="detail">
                    {periodLabels[period]}
                  </Text>
                  {/* 4454:607 — 11px/#33d07a + py-0.5 → 2+13+2 = 17px */}
                  <span className="inline-flex h-[17px] items-center justify-center rounded-[10px] bg-[rgba(22,185,121,0.12)] px-2">
                    <Text
                      as="span"
                      className="text-[11px] leading-[13px] text-[#33d07a]"
                      variant="caption"
                    >
                      {copy.yield} 0.00%
                    </Text>
                  </span>
                </div>
                <Text as="span" className="text-[12px] text-foreground/40" variant="support">
                  {copy.discountRange} {BOND_DISCOUNT_RANGES[period]}
                </Text>
                <Text as="span" className="text-[12px] text-foreground/40" variant="support">
                  {copy.sold} $0.00
                </Text>
              </div>
              <div className="grid shrink-0 gap-1 text-right">
                <Text as="span" className="text-[12px] text-foreground/40" variant="support">
                  {copy.currentDiscount}
                </Text>
                <Text
                  as="strong"
                  className="text-[20px] font-semibold text-coral-emphasis"
                  variant="copy"
                >
                  {discount.endsWith('%') ? discount : `${discount}%`}
                </Text>
                <Text as="span" className="text-[12px] text-foreground/40" variant="support">
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
