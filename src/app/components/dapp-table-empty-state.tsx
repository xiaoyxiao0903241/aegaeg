import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'

function SkeletonRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-3.5 max-[820px]:gap-2.5',
        className,
      )}
    >
      <span className="h-3.5 w-[120px] shrink-0 rounded-[8px] bg-border max-[820px]:h-3 max-[820px]:w-[72px]" />
      <span className="flex min-w-0 flex-1 items-center">
        <span className="h-3.5 w-2.5 rounded-[8px] bg-border max-[820px]:h-3 max-[820px]:w-2" />
      </span>
      <span className="h-3.5 w-[90px] shrink-0 rounded-[8px] bg-border max-[820px]:h-3 max-[820px]:w-[54px]" />
      <span className="h-3.5 w-[70px] shrink-0 rounded-[8px] bg-border max-[820px]:h-3 max-[820px]:w-[42px]" />
    </div>
  )
}

export function DappTableEmptyState({
  className,
  rows = 3,
}: {
  className?: string
  rows?: number
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        revealClass(),
        'flex flex-col items-center rounded-[18px] bg-card px-6 py-[30px] shadow-card',
        'max-[820px]:border max-[820px]:border-border max-[820px]:px-4 max-[820px]:py-[22px] max-[820px]:shadow-none',
        className,
      )}
      data-reveal
    >
      <div className="flex w-full flex-col gap-3 max-[820px]:gap-[11px]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <SkeletonRow key={rowIndex} />
        ))}
      </div>
    </div>
  )
}
