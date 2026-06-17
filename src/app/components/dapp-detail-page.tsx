import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

/** 右侧 detail 列内容区 —— 各 tab SSOT（PC padding 一致；H5 外边距由 shell window `p-[18px]` 承担） */
export function dappDetailPageClass(options?: {
  className?: string
  /** Swap H5 pager 第二页：与标准 tab 相同，不额外加水平 padding */
  pager?: boolean
}) {
  return cn(
    'min-w-0',
    'dapp:pt-10 dapp:px-7 dapp:pb-[calc(30px+var(--shadow-bleed))]',
    'max-dapp:p-0',
    options?.pager && 'max-dapp:px-0',
    options?.className,
  )
}

export function DappDetailPage({
  children,
  className,
  pager = false,
}: {
  children: ReactNode
  className?: string
  pager?: boolean
}) {
  return <div className={dappDetailPageClass({ className, pager })}>{children}</div>
}
