import type { ReactNode } from 'react'
import { QuickLink, type QuickLinkProps } from '~/app/components/quick-link'
import { cn } from '~/lib/utils'

export type { QuickLinkProps as QuickLinkItem }

export function QuickLinks({
  className,
  items,
}: {
  className?: string
  items: QuickLinkProps[]
}) {
  return (
    <div className={cn('mt-3.5 grid gap-2 max-[820px]:mt-0', className)}>
      {items.map((item) => (
        <QuickLink key={item.href} {...item} />
      ))}
    </div>
  )
}
