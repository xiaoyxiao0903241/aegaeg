import { DappSkeleton } from '~/app/shell/dapp-skeleton'
import { Card } from '~/shared/ui/card'

/** 仓位卡 loading 骨架（对齐 outlined 卡：period · 双列 · 双 CTA）。 */
export function AssetsPositionRowSkeleton() {
  return (
    <Card aria-busy aria-hidden className="grid gap-2 p-4 shadow-none" surface="outlined">
      <div className="flex items-center gap-2">
        <DappSkeleton className="h-6 w-12 rounded-full" />
        <div className="ml-auto flex items-center gap-2">
          <DappSkeleton className="h-3.5 w-12" />
          <DappSkeleton className="h-3.5 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <DappSkeleton className="h-3 w-12" />
          <DappSkeleton className="h-5 w-20" />
          <DappSkeleton className="h-5 w-16 rounded-control" />
        </div>
        <div className="grid justify-items-end gap-1">
          <DappSkeleton className="h-3 w-8" />
          <DappSkeleton className="h-5 w-20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DappSkeleton className="h-7 w-full rounded-full" />
        <DappSkeleton className="h-7 w-full rounded-full" />
      </div>
    </Card>
  )
}

/** 左栏仓位列表 loading：3 张骨架卡。 */
export function AssetsPositionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="grid gap-3">
      {Array.from({ length: count }, (_, i) => (
        <AssetsPositionRowSkeleton key={i} />
      ))}
    </div>
  )
}
