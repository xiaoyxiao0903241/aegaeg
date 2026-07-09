import { Card } from '~/shared/ui/card'
import { communityStatCardMobileShell } from '~/views/dapp/community/community-content-primitives'
import { seasonCard } from '~/app/shell/components/season-card'
import { dappTableCell } from '~/app/shell/components/dapp-table-card'
import { cn } from '~/shared/lib/utils'

const skeletonSurfaceClass =
  'bg-skeleton motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'

const skeletonDarkClass =
  'bg-skeleton-on-dark motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'

const tableCell = dappTableCell()
const TABLE_CELL = `${tableCell.border()} ${tableCell.minWidth()} px-3 py-2.5 text-left whitespace-nowrap font-normal max-dapp:px-2.5 max-dapp:py-2`

export function DappSkeleton({
  className,
  tone = 'surface',
}: {
  className?: string
  tone?: 'dark' | 'surface'
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block rounded-md',
        tone === 'dark' ? skeletonDarkClass : skeletonSurfaceClass,
        className,
      )}
    />
  )
}

export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      as="article"
      surface="elevated"
      className={cn('flex flex-col items-start gap-1.5 rounded-md px-4 py-3.5', className)}
    >
      <DappSkeleton className="h-3 w-18 max-w-[55%]" />
      <DappSkeleton className="mt-2 h-5 w-24 max-w-[70%]" />
    </Card>
  )
}

export function SeasonOptionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={seasonCard({ selected: false }).root()}
    >
      <div className="flex items-start justify-between gap-1">
        <DappSkeleton className="h-3.5 w-16" />
        <DappSkeleton className="size-[var(--dapp-skeleton-chip-size)] shrink-0 rounded-[calc(var(--dapp-skeleton-chip-size)/2)]" />
      </div>
      <DappSkeleton className="h-3 w-full max-w-24" />
      <DappSkeleton className="h-3 w-full max-w-28" />
      <DappSkeleton className="h-3 w-20" />
      <DappSkeleton className="mt-auto h-5 w-full rounded-full" />
    </div>
  )
}

export function CurrentTitleCardBodySkeleton() {
  return (
    <div aria-hidden="true" className="grid grid-cols-2 gap-x-3 gap-y-1.5">
      <DappSkeleton className="h-3 w-16" />
      <DappSkeleton className="ml-auto h-3 w-20" />
      <DappSkeleton className="h-5 w-[78%]" />
      <DappSkeleton className="ml-auto h-5 w-10" />
      <DappSkeleton className="h-3 w-[58%]" />
      <DappSkeleton className="ml-auto h-3 w-[88%]" />
    </div>
  )
}

export function RewardsHeroBodySkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div aria-hidden="true" className="grid gap-2">
      <DappSkeleton
        className={cn(compact ? 'h-4.5 w-[62%]' : 'h-5 w-[58%]')}
        tone="dark"
      />
      <div className="grid gap-1.5">
        <DappSkeleton className="h-3 w-full" tone="dark" />
        <DappSkeleton className="h-3 w-[78%]" tone="dark" />
      </div>
    </div>
  )
}

export function RewardBalanceCardSkeleton() {
  return (
    <Card as="article" surface="outlined">
      <div className="flex items-center justify-between gap-3">
        <DappSkeleton className="h-3 w-24" />
        <DappSkeleton className="h-3 w-16" />
      </div>
      <DappSkeleton className="mt-2 h-7 w-[42%]" />
      <DappSkeleton className="mt-1.5 h-3 w-[78%]" />
    </Card>
  )
}

export function ProgressCardSkeleton() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <DappSkeleton className="h-3 w-24" />
          <DappSkeleton className="h-3 w-20" />
        </div>
        <DappSkeleton className="h-1.5 w-full rounded-full" />
      </div>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <DappSkeleton className="h-3 w-20" />
          <DappSkeleton className="h-3 w-24" />
        </div>
        <DappSkeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  )
}

export function CommunityStatCardSkeleton({ dark = false }: { dark?: boolean }) {
  const tone = dark ? 'dark' : 'surface'

  return (
    <Card
      as="article"
      surface={dark ? 'inverse' : 'elevated'}
      className={cn(
        'community-stat flex min-h-22 flex-col items-start gap-1 p-[var(--dapp-community-stat-padding)]',
        dark && 'is-dark',
        communityStatCardMobileShell(),
      )}
    >
      <DappSkeleton className="h-3 w-16" tone={tone} />
      <DappSkeleton className="mt-2 h-7 w-14" tone={tone} />
      <DappSkeleton className="mt-1 h-3 w-24" tone={tone} />
      <DappSkeleton className="mt-1 h-3 w-32" tone={tone} />
    </Card>
  )
}

export function TableRowSkeleton({
  columns,
  isLast = false,
}: {
  columns: number
  isLast?: boolean
}) {
  return (
    <tr>
      {Array.from({ length: columns }, (_, index) => (
        <td className={cn(TABLE_CELL, isLast && 'border-b-0')} key={index}>
          <DappSkeleton className="h-3.5 w-full max-w-22" />
        </td>
      ))}
    </tr>
  )
}

export function SwapBalanceSkeleton() {
  return <DappSkeleton className="inline-block h-3 w-22" />
}

export function SwapMetaValueSkeleton({ className }: { className?: string }) {
  return <DappSkeleton className={cn('inline-block h-3.5 w-full max-w-37', className)} />
}

export function SwapAmountSkeleton() {
  return <DappSkeleton className="ml-auto h-7 w-28 max-w-[55%]" />
}

export function GenesisPromoTitleSkeleton() {
  return <DappSkeleton className="h-3.5 w-[72%]" tone="dark" />
}

export function GenesisPromoBodySkeleton() {
  return <DappSkeleton className="h-3 w-[82%]" tone="dark" />
}
