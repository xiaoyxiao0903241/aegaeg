import type { ReactNode } from 'react'
import { FaqList } from '../../components/faq-list'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export function FaqStack({
  className,
  defaultOpenFirst = true,
  items,
}: {
  className?: string
  defaultOpenFirst?: boolean
  items: Array<{ answer: ReactNode; question: string }>
}) {
  return (
    <FaqList
      className={cn(
        revealClass(),
        'group-data-[tab=rewards]/shell:justify-items-start',
        className,
      )}
      data-reveal
      defaultOpenFirst={defaultOpenFirst}
      items={items}
      variant="dapp"
    />
  )
}
