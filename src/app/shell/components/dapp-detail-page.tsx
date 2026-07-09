import type { ReactNode } from 'react'
import { dappDetailPageBottomClass } from '~/app/dapp-detail-layout'
import { cn } from '~/shared/lib/utils'

/** 右侧 detail 列内容区 —— 各 tab SSOT（PC padding 一致；H5 外边距由 shell window 承担） */
function dappDetailPageClass(options?: { className?: string }) {
  return cn(
    'min-w-0',
    'dapp:pt-10 dapp:px-7',
    dappDetailPageBottomClass,
    'max-dapp:p-0',
    // First DappSection carries mt-8.5 for block rhythm — drop it at page top (e.g. Community disconnected).
    '[&>section:first-child]:mt-0',
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
