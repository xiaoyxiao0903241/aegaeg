import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'
import type { BondPeriod } from '~/core/staking/staking-period'

const PERIODS: BondPeriod[] = ['180', '360', '540']

type BondPeriodCardCopy = {
  yield: string
  discountRange: string
  sold: string
  currentDiscount: string
  discountPrice: string
}

/** Figma bondList — vertical radio cards; discount from chain, other metrics honest empty. */
export function BondPeriodList({
  ariaLabel,
  periodLabel,
  value,
  onChange,
  periodLabels,
  discounts,
  copy,
}: {
  ariaLabel: string
  periodLabel: string
  value: BondPeriod
  onChange: (period: BondPeriod) => void
  periodLabels: Record<BondPeriod, string>
  discounts: Record<BondPeriod, string>
  copy: BondPeriodCardCopy
}) {
  return (
    <div className="grid gap-2.5" role="radiogroup" aria-label={ariaLabel}>
      <Text as="span" tone="muted-foreground" variant="detail">
        {periodLabel}
      </Text>
      <div className="grid gap-2.5">
        {PERIODS.map((period) => {
          const selected = period === value
          return (
            <button
              aria-checked={selected}
              className={cn(
                'flex w-full items-start justify-between gap-3 rounded-2xl border p-3.5 text-left transition-colors',
                selected ? 'border-[1.4px] border-primary bg-primary/10' : 'border-border bg-card',
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
                      selected ? 'border-2 border-primary bg-card' : 'border-[1.5px] border-border',
                    )}
                  >
                    {selected ? (
                      <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                    ) : null}
                  </span>
                  <Text as="span" className="font-semibold" variant="detail">
                    {periodLabels[period]}
                  </Text>
                  <span className="rounded-[10px] bg-[rgba(22,185,121,0.12)] px-2 py-0.5">
                    <Text as="span" className="text-[11px] text-success" variant="detail">
                      {copy.yield} —
                    </Text>
                  </span>
                </div>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {copy.discountRange} —
                </Text>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {copy.sold} —
                </Text>
              </div>
              <div className="grid shrink-0 gap-1 text-right">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {copy.currentDiscount}
                </Text>
                <Text as="strong" className="text-xl font-semibold text-primary" variant="copy">
                  {discounts[period]}
                </Text>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {copy.discountPrice} —
                </Text>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
