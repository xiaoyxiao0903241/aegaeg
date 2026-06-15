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
    <div className={dappCardClass('metaList', { className })}>
      {items.map((item, index) => (
        <p className={dappLayout.metaRow} key={index}>
          <span className={dappTextClass('body', { tone: connected ? 'body' : 'subtle' })}>
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
