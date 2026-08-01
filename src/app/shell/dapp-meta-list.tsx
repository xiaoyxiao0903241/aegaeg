import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

export type DappMetaListItem = {
  label: ReactNode
  value: ReactNode
  valueClassName?: string
}

export function DappMetaList({
  className,
  items,
}: {
  className?: string
  items: DappMetaListItem[]
}) {
  return (
    <Card as="div" surface="outlined" className={cn('grid shrink-0 gap-2', className)}>
      {items.map((item, index) => (
        <p className="m-0 flex items-center justify-between gap-3" key={index}>
          <Text as="span" variant="support" tone="muted-foreground">
            {item.label}
          </Text>
          <Text
            as="strong"
            variant="support"
            className={cn('mt-0 text-right font-semibold', item.valueClassName)}
          >
            {item.value}
          </Text>
        </p>
      ))}
    </Card>
  )
}
