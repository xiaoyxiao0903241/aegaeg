import type { ReactNode } from 'react'
import { dappCardClass, dappLayout, dappTextClass } from '../../components/primitive-styles'
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
    <div
      className={
        connected
          ? dappCardClass('metaList', { className })
          : cn('mt-3.5 grid shrink-0 gap-2.5 pt-1.5 tracking-[-0.26px]', className)
      }
    >
      {items.map((item, index) => (
        <p className={dappLayout.metaRow} key={index}>
          <span className={dappTextClass('metaLabel', { tone: connected ? 'body' : 'subtle' })}>
            {item.label}
          </span>
          <strong className={cn(dappTextClass('metaValue'), item.valueClassName)}>
            {item.value}
          </strong>
        </p>
      ))}
    </div>
  )
}
