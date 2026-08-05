import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'

/**
 * 右栏详情壳 — PC padding；H5 由 shell window 出边距。
 * 节距由 Detail gap 承担（PC 34 / H5 24）。
 *
 * @see docs/foundation/component-usage.md
 */
export function Detail({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-8.5 max-dapp:gap-6',
        'dapp:px-7 dapp:pt-10',
        'dapp:pb-[calc(1.875rem+var(--shadow-bleed))]',
        'max-dapp:p-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
