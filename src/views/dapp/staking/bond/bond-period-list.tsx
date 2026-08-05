import type { BondPeriod } from '~/core/staking/staking-period'
import { Text } from '~/shared/components/text'
import { BondPeriodCard } from '~/views/dapp/staking/bond/bond-period-card'

const PERIODS: BondPeriod[] = ['180', '360', '540']

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
        {PERIODS.map((period) => {
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
