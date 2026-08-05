/**
 * 释放目的与税率说明卡
 *
 * 左侧写释放目的，右侧按周期列出税率；20 天与 60 天档灰底高亮。
 */
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/** 税率表高亮列：20 天与 60 天档 */
const TAX_HIGHLIGHT_PERIOD_INDEX = new Set([1, 3])

export function ReleaseTaxCard({
  periods,
  purposeBody,
  purposeTitle,
  rates,
  taxPeriod,
  taxRate,
  taxTitle,
}: {
  periods: ReadonlyArray<string>
  purposeBody: string
  purposeTitle: string
  rates: ReadonlyArray<string>
  taxPeriod: string
  taxRate: string
  taxTitle: string
}) {
  return (
    <Card
      as="div"
      surface="elevated"
      className="flex flex-col gap-6 rounded-2xl p-6"
      data-slot-id="release-mechanism-meta"
    >
      <div className="grid gap-6 dapp:grid-cols-2">
        <div className="grid content-start gap-1.5">
          <Text as="p" className="m-0 font-medium text-foreground" variant="detail">
            {purposeTitle}
          </Text>
          <Text as="p" className="m-0 text-foreground/40" variant="caption">
            {purposeBody}
          </Text>
        </div>

        <div className="grid content-start gap-2">
          <Text as="p" className="m-0 font-medium text-foreground" variant="detail">
            {taxTitle}
          </Text>
          <div className="grid grid-cols-[auto_1fr] items-stretch gap-x-4">
            <div className="grid grid-rows-2 gap-4 py-2.5">
              <Text as="span" className="self-center text-foreground/40" variant="caption">
                {taxPeriod}
              </Text>
              <Text as="span" className="self-center text-foreground/40" variant="caption">
                {taxRate}
              </Text>
            </div>
            <div className="grid grid-cols-4 gap-0">
              {periods.map((period, i) => (
                <div
                  className={cn(
                    'grid grid-rows-2 gap-4 px-1 py-2.5 text-center',
                    TAX_HIGHLIGHT_PERIOD_INDEX.has(i) && 'rounded-sm bg-muted',
                  )}
                  data-slot-id={
                    i === 1 ? 'tax-highlight-20' : i === 3 ? 'tax-highlight-60' : undefined
                  }
                  key={period}
                >
                  <Text
                    as="span"
                    className="self-center font-medium text-foreground"
                    variant="caption"
                  >
                    {period}
                  </Text>
                  <Text
                    as="span"
                    className={cn(
                      'self-center font-semibold',
                      rates[i] === '1%' ? 'text-primary' : 'text-foreground',
                    )}
                    variant="caption"
                  >
                    {rates[i]}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
