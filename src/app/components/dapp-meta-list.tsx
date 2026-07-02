import type { ReactNode } from 'react'
import { Card } from '~/components/card'
import { Text } from '~/components/text'
import { cn } from '~/lib/utils'

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
      className={cn(
        'grid shrink-0 gap-2 rounded-sm px-3.5 py-3 tracking-[-0.26px]',
        className,
      )}
    >
      {items.map((item, index) => (
        <p className="m-0 flex items-center justify-between gap-3" key={index}>
          <Text
            as="span"
            size="sm"
            tone={sessionReady ? 'body' : 'subtle'}
            className={sessionReady ? 'max-dapp:text-faint' : undefined}
          >
            {item.label}
          </Text>
          <Text
            as="strong"
            size="sm"
            weight="semibold"
            className={cn('mt-0 text-right', item.valueClassName)}
          >
            {item.value}
          </Text>
        </p>
      ))}
    </Card>
  )
}
