import { Card } from '~/components/card'
import { communityStatCardH5Layout } from '~/app/components/dapp-card'
import { seasonCardRadiusClass, seasonCardSizeClass } from '~/app/dapp-detail-layout'
import { dappTableCellBorderClass } from '~/app/components/dapp-table-shell'
import { cn } from '~/lib/utils'

const skeletonSurfaceClass =
  'bg-[oklch(94.5%_0.008_260)] motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'

const skeletonDarkClass =
  'bg-[oklch(100%_0_0/18%)] motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'

const TABLE_CELL = `${dappTableCellBorderClass} px-3 py-2.5 text-left whitespace-nowrap font-normal max-dapp:px-2.5 max-dapp:py-2`

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
      className={cn('flex flex-col gap-1.5 px-4 py-3.5', className)}
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
      className={cn(
        'flex shrink-0 flex-col gap-1.5 border border-border bg-card p-3',
        seasonCardRadiusClass,
        seasonCardSizeClass,
      )}
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
    <div aria-hidden="true" className="grid min-h-[3.75rem] gap-1.5">
      <DappSkeleton className="h-4 w-[78%]" />
      <div className="grid min-h-[2.25rem] gap-1.5">
        <DappSkeleton className="h-3 w-full" />
        <DappSkeleton className="h-3 w-[58%]" />
      </div>
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

export function SideCardSkeleton({
  hintLines = 2,
  valueWidth = 'w-[68%]',
}: {
  hintLines?: 1 | 2
  valueWidth?: string
}) {
  return (
    <>
      <DappSkeleton className="h-3 w-20" />
      <DappSkeleton className={cn('mt-2 h-4', valueWidth)} />
      <DappSkeleton className={cn('mt-1.5 h-3', hintLines === 2 ? 'w-full' : 'w-[82%]')} />
      {hintLines === 2 ? <DappSkeleton className="mt-1 h-3 w-[58%]" /> : null}
    </>
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
      tone={dark ? 'dark' : undefined}
      surface={dark ? undefined : 'elevated'}
      className={cn(
        'community-stat flex min-h-22 flex-col items-start gap-1 rounded-md border-0 p-[var(--dapp-community-stat-padding)] shadow-card',
        dark && 'is-dark',
        communityStatCardH5Layout,
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

export function ContributionBlockSkeleton() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <DappSkeleton className="h-3 w-20" />
          <DappSkeleton className="h-3 w-28" />
        </div>
        <DappSkeleton className="h-1.5 w-full rounded-full" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-0 border-collapse text-xs leading-[1.5]">
          <tbody>
            <TableRowSkeleton columns={5} />
            <TableRowSkeleton columns={5} isLast />
          </tbody>
        </table>
      </div>
    </div>
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
