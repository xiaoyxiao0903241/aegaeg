import type { ReactNode } from 'react'
import { cn } from '~/shared/lib/utils'

/** Right detail column content area (PC padding; H5 margin from shell window). */
export function DappDetailPage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'min-w-0',
        'dapp:pt-10 dapp:px-7',
        'dapp:pb-[calc(1.875rem+var(--shadow-bleed))]',
        'max-dapp:p-0',
        // First DappSection / DappDetailBlock carries mt-8.5 — drop it at page top.
        '[&>section:first-child]:mt-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
