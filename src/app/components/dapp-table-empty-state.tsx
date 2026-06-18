import type { ReactNode } from 'react'
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
      <span className="h-3.5 w-[120px] shrink-0 rounded-[8px] bg-border max-dapp:h-3 max-dapp:w-[72px]" />
      <span className="flex min-w-0 flex-1 items-center">
        <span className="h-3.5 w-2.5 rounded-[8px] bg-border max-dapp:h-3 max-dapp:w-2" />
      </span>
      <span className="h-3.5 w-[90px] shrink-0 rounded-[8px] bg-border max-dapp:h-3 max-dapp:w-[54px]" />
      <span className="h-3.5 w-[70px] shrink-0 rounded-[8px] bg-border max-dapp:h-3 max-dapp:w-[42px]" />
    </div>
  )
}

export function DappTableEmptyState({
  className,
  rows = 3,
  children,
}: {
  className?: string
  rows?: number
  children?: ReactNode
}) {
  return (
    <div
      aria-hidden={children ? undefined : true}
      className={cn(
        revealClass(),
        'flex flex-col items-center rounded-[18px] bg-card px-6 py-[30px] shadow-card',
        'max-dapp:border max-dapp:border-border max-dapp:px-4 max-dapp:py-[22px] max-dapp:shadow-none',
        children && 'gap-[18px]',
        className,
      )}
      data-reveal
    >
      <div
        aria-hidden="true"
        className="flex w-full flex-col gap-3 max-dapp:gap-[11px]"
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <SkeletonRow key={rowIndex} />
        ))}
      </div>
      {children}
    </div>
  )
}
