import type { ReactNode } from 'react'
import { cn } from '~/shared/lib/utils'

/** 右侧 detail 列内容区 —— 各 tab SSOT（PC padding 一致；H5 外边距由 shell window 承担） */
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
