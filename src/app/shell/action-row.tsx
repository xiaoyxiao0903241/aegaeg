import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'

/**
 * 表单下方的操作按钮行。
 *
 * 单个子元素占满整行，两个及以上子元素等分两列。
 */
export function ActionRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('grid shrink-0 grid-cols-1 gap-2 has-[>:nth-child(2)]:grid-cols-2', className)}
    >
      {children}
    </div>
  )
}
