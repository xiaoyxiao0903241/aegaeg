import { Skeleton } from '~/app/shell/skeleton'
import { Card } from '~/shared/components/card'

/** 仓位卡加载骨架（对齐描边卡：周期 · 双列 · 双操作按钮） */
export function AssetsPositionRowSkeleton() {
  return (
    <Card aria-busy aria-hidden className="grid gap-2" surface="outlined">
      <div className="flex items-center gap-2">
        <Skeleton className="w-12 rounded-full" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-3.5 w-12" />
          <Skeleton className="h-3.5 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="w-16 rounded-control" />
        </div>
        <div className="grid justify-items-end gap-1">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="w-full rounded-full" />
        <Skeleton className="w-full rounded-full" />
      </div>
    </Card>
  )
}

/** 左栏仓位列表加载骨架：多张骨架卡 */
export function AssetsPositionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="grid gap-3">
      {Array.from({ length: count }, (_, i) => (
        <AssetsPositionRowSkeleton key={i} />
      ))}
    </div>
  )
}
