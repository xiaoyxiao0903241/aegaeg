import type { ReactNode } from 'react'
import { dappTableCardShellClass } from '~/app/components/dapp-table-shell'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'

function SkeletonRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-3.5 max-dapp:gap-2.5',
        className,
      )}
    >
      <span className="h-3.5 w-30 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-18" />
      <span className="flex min-w-0 flex-1 items-center">
        <span className="h-3.5 w-2.5 rounded-sm bg-border max-dapp:h-3 max-dapp:w-2" />
      </span>
      <span className="h-3.5 w-22 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-14" />
      <span className="h-3.5 w-18 shrink-0 rounded-sm bg-border max-dapp:h-3 max-dapp:w-10" />
    </div>
  )
}

export function DappTableEmptyState({
  className,
  embedded = false,
  rows = 3,
  showSkeleton = true,
  children,
}: {
  className?: string
  /** Renders inside `DappTableCard` content — no outer card shell. */
  embedded?: boolean
  rows?: number
  showSkeleton?: boolean
  children?: ReactNode
}) {
  const skeleton = showSkeleton ? (
    <div
      aria-hidden="true"
      className="flex w-full flex-col gap-3 max-dapp:gap-2.5"
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <SkeletonRow key={rowIndex} />
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
    <div
      aria-hidden={children ? undefined : true}
      className={cn(
        revealClass(),
        dappTableCardShellClass,
        'flex flex-col items-center px-6 py-7.5',
        'max-dapp:px-4 max-dapp:py-5.5',
        children && 'gap-4.5',
        className,
      )}
      data-reveal
    >
      {skeleton}
      {children}
    </div>
  )
}
