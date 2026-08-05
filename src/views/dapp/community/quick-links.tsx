import { cn } from '~/shared/lib/utils'
import { QuickLink, type QuickLinkProps } from '~/views/dapp/community/quick-link'

export type { QuickLinkProps as QuickLinkItem }

/** 快捷入口链接组，纵向堆叠。 */
export function QuickLinks({ className, items }: { className?: string; items: QuickLinkProps[] }) {
  return (
    <div className={cn('grid gap-2', className)}>
      {items.map((item) => (
        <QuickLink key={item.href} {...item} />
      ))}
    </div>
  )
}
