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
  connected = true,
  items,
}: {
  className?: string
  connected?: boolean
  items: DappMetaListItem[]
}) {
  return (
    <Card
      as="div"
      surface="outlined"
      className={cn(
        'mt-3.5 grid shrink-0 gap-2 rounded-[12px] px-[14px] py-[13px] tracking-[-0.26px] max-[820px]:mt-3',
        className,
      )}
    >
      {items.map((item, index) => (
        <p className="m-0 flex items-start justify-between gap-3" key={index}>
          <Text
            as="span"
            size="sm"
            tone={connected ? 'body' : 'subtle'}
            className={connected ? 'max-[820px]:text-faint' : undefined}
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
