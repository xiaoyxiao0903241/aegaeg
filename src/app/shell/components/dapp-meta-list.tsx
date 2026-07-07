import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

export type DappMetaListItem = {
  label: ReactNode
  value: ReactNode
  valueClassName?: string
}

export function DappMetaList({
  className,
  sessionReady = true,
  items,
}: {
  className?: string
  sessionReady?: boolean
  items: DappMetaListItem[]
}) {
  return (
    <Card
      as="div"
      surface="outlined"
      className={cn('grid shrink-0 gap-2 rounded-sm px-3.5 py-3', className)}
    >
      {items.map((item, index) => (
        <div className="m-0 flex items-center justify-between gap-3" key={index}>
          <Text
            as="span"
            variant="meta-label"
            tone={sessionReady ? 'strong' : 'subtle'}
          >
            {item.label}
          </Text>
          <Text
            as="strong"
            variant="meta-value"
            className={cn('mt-0 text-right', item.valueClassName)}
          >
            {item.value}
          </Text>
        </div>
      ))}
    </Card>
  )
}
