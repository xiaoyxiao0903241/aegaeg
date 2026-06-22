import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

/** 右侧 detail 列内容区 —— 各 tab SSOT（PC padding 一致；H5 外边距由 shell window 承担） */
export function dappDetailPageClass(options?: { className?: string }) {
  return cn(
    'min-w-0',
    'dapp:pt-10 dapp:px-7 dapp:pb-[calc(1.875rem+var(--shadow-bleed))]',
    'max-dapp:p-0',
    options?.className,
  )
}

export function DappDetailPage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={dappDetailPageClass({ className })}>{children}</div>
}
