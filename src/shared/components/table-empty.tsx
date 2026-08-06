/**
 * DApp 表空态 — Empty / Auth
 */

import type { ReactNode } from 'react'

import { Empty } from '~/shared/components/empty'
import { Frame } from '~/shared/components/table-frame'
import { Text } from '~/shared/components/text'
import { cn, revealClass } from '~/shared/lib/utils'

/** 表格空态：嵌在表内或独立 Frame 展示 */
function TableEmpty({
  body,
  className,
  embedded = false,
  title,
}: {
  body?: string
  className?: string
  embedded?: boolean
  title: string
}) {
  if (embedded) {
    return <Empty body={body} className={className} title={title} />
  }

  return (
    <Frame className={cn(revealClass(), className)} data-reveal>
      <Empty
        body={body}
        className="p-(--dapp-table-empty-padding) max-dapp:p-(--dapp-table-empty-padding-h5)"
        title={title}
      />
    </Frame>
  )
}

/** 表格空态容器：可选骨架行，供纯空态与 Auth 共用 */
function EmptyState({
  className,
  embedded = false,
  rows = 3,
  showSkeleton = true,
  children,
}: {
  className?: string
  embedded?: boolean
  rows?: number
  showSkeleton?: boolean
  children?: ReactNode
}) {
  const skeleton = showSkeleton ? (
    <div aria-hidden="true" className="flex w-full flex-col gap-3 max-dapp:gap-2.5">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <EmptySkeletonRow key={rowIndex} />
      ))}
    </div>
  ) : null

  if (embedded) {
    return (
      <div
        className={cn(
          'flex flex-col items-center py-4 max-dapp:py-3',
          children && (showSkeleton ? 'gap-4.5' : 'gap-3'),
          className,
        )}
      >
        {skeleton}
        {children}
      </div>
    )
  }

  return (
    <Frame
      aria-hidden={children ? undefined : true}
      className={cn(
        revealClass(),
        'flex flex-col items-center px-6 py-7.5',
        'max-dapp:px-4 max-dapp:py-5.5',
        children && 'gap-4.5',
        className,
      )}
      data-reveal
    >
      {skeleton}
      {children}
    </Frame>
  )
}

function EmptySkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-full items-center gap-3.5 max-dapp:gap-2.5', className)}>
      <span className="w-30 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-18" />
      <span className="flex min-w-0 flex-1 items-center">
        <span className="w-2.5 rounded-sm bg-border max-dapp:h-3 max-dapp:w-2" />
      </span>
      <span className="w-22 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-14" />
      <span className="w-18 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-10" />
    </div>
  )
}

/**
 * 未连接钱包空态。标题 / 正文 / 连接 CTA 均由调用方传入（shared 不嵌入文案）。
 * @example
 * <Table.Auth title={t…} body={t…}>
 *   <WalletConnectChip variant="primary" />
 * </Table.Auth>
 */
function Auth({
  body,
  children,
  className,
  embedded = false,
  showSkeleton = true,
  title,
}: {
  body: string
  children: ReactNode
  className?: string
  embedded?: boolean
  showSkeleton?: boolean
  title: string
}) {
  return (
    <EmptyState className={cn(className)} embedded={embedded} showSkeleton={showSkeleton}>
      <div className="grid w-full gap-1.5 text-center">
        <Text as="p" variant="headline" className="m-0 text-sm leading-[1.2] tracking-[-0.02em]">
          {title}
        </Text>
        <Text as="p" variant="support" tone="muted-foreground" className="m-0">
          {body}
        </Text>
      </div>
      {children}
    </EmptyState>
  )
}

export { Auth, TableEmpty }
