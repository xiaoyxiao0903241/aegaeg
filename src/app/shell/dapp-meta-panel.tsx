import type { ReactNode } from 'react'
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
          <Text as="span" variant="detail" tone="muted-foreground">
            {item.label}
          </Text>
          <Text
            as="strong"
            variant="detail"
            className={cn('mt-0 text-right font-semibold', item.valueClassName)}
          >
            {item.value}
          </Text>
        </p>
      ))}
    </Card>
  )
}
