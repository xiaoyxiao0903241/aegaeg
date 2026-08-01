import type { ReactNode } from 'react'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

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
          {/* Figma `text/muted` = foreground@40% — not `muted-foreground` (70%). */}
          <Text as="span" variant="detail" className="text-foreground/40">
            {item.label}
          </Text>
          <Text
            as="strong"
            variant="detail"
            className={cn('mt-0 text-right font-semibold', item.valueClassName)}
          >
            {typeof item.value === 'string' ? <DappCountValue text={item.value} /> : item.value}
          </Text>
        </p>
      ))}
    </Card>
  )
}
