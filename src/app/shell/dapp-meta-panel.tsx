import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Text } from '~/shared/ui/text'

export function DappMetaPanel({
  className,
  items,
}: {
  className?: string
  items: Array<{
    label: ReactNode
    value: ReactNode
    valueClassName?: string
  }>
}) {
  return (
    <Card
      as="div"
      surface="outlined"
      className={cn('mt-3.5 grid shrink-0 gap-2 max-dapp:mt-3', className)}
    >
      {items.map((item, index) => (
        <p className="m-0 flex items-center justify-between gap-3" key={index}>
          {/* Figma infoBox 行 ~17；detail 默认 leading 1.5→21 撑破壳 — leading-4 合成。 */}
          {/* Figma `text/muted` = foreground@40% — not `muted-foreground` (70%). */}
          <Text as="span" variant="detail" className="leading-4 text-foreground/40">
            {item.label}
          </Text>
          <Text
            as="strong"
            variant="detail"
            className={cn(
              'mt-0 text-right leading-4 font-semibold [&_a]:text-inherit [&_a]:no-underline [&_a]:hover:underline',
              item.valueClassName,
            )}
          >
            {typeof item.value === 'string' ? <DappCountValue text={item.value} /> : item.value}
          </Text>
        </p>
      ))}
    </Card>
  )
}
