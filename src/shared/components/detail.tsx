import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'

/**
 * 右栏详情容器
 *
 * 桌面端自带左右内边距；移动端由外层窗口给出边距。
 * 区块间距由容器统一承担。
 *
 * @see docs/foundation/component-usage.md
 */
export function Detail({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-8.5 max-dapp:gap-6',
        'dapp:px-6 dapp:pt-7.5',
        'dapp:pb-[calc(1.5rem+var(--shadow-bleed))]',
        'max-dapp:p-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
