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
    <div className={cn('grid gap-2', className)}>
      {items.map((item) => (
        <QuickLink key={item.href} {...item} />
      ))}
    </div>
  )
}
