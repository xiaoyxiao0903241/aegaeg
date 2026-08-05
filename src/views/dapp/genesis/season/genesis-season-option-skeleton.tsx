import { Skeleton } from '~/app/shell/skeleton'
import { seasonCard } from '~/views/dapp/genesis/season/genesis-season-carousel'

export function SeasonOptionSkeleton() {
  return (
    <div aria-hidden="true" className={seasonCard({ selected: false }).root()}>
      <div className="flex items-start justify-between gap-1">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="size-(--dapp-skeleton-chip-size) shrink-0 rounded-[calc(var(--dapp-skeleton-chip-size)/2)]" />
      </div>
      <Skeleton className="h-3 w-full max-w-24" />
      <Skeleton className="h-3 w-full max-w-28" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-auto w-full rounded-full" />
    </div>
  )
}
