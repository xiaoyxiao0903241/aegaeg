import { dappCardClass, dappLayout } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

const skeletonSurfaceClass =
  'bg-[oklch(94.5%_0.008_260)] motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'

const skeletonDarkClass =
  'bg-[oklch(100%_0_0/18%)] motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'

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
    <article
      className={dappCardClass('metric', {
        className: cn('px-4 py-3.5', className),
      })}
    >
      <DappSkeleton className="h-3 w-[72px] max-w-[55%]" />
      <DappSkeleton className="mt-[9px] h-5 w-[96px] max-w-[70%]" />
    </article>
  )
}

export function SeasonOptionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={cn(dappLayout.seasonOption, 'pointer-events-none')}
    >
      <DappSkeleton className="aspect-square w-[17px] shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <DappSkeleton className="h-3.5 w-[72px]" />
        <DappSkeleton className="mt-1.5 h-3 w-[min(100%,180px)]" />
      </div>
      <div className="grid flex-none justify-items-end gap-1">
        <DappSkeleton className="h-[22px] w-[52px] rounded-full" />
        <DappSkeleton className="h-3 w-[72px]" />
      </div>
    </div>
  )
}

export function CurrentTitleCardBodySkeleton() {
  return (
    <div aria-hidden="true" className="grid min-h-[3.75rem] gap-1.5">
      <DappSkeleton className="h-[17px] w-[78%]" />
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
        className={cn(compact ? 'h-[18px] w-[62%]' : 'h-[21px] w-[58%]')}
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
      <DappSkeleton className={cn('mt-2 h-[17px]', valueWidth)} />
      <DappSkeleton className={cn('mt-1.5 h-3', hintLines === 2 ? 'w-full' : 'w-[82%]')} />
      {hintLines === 2 ? <DappSkeleton className="mt-1 h-3 w-[58%]" /> : null}
    </>
  )
}

export function RewardBalanceCardSkeleton() {
  return (
    <article className={dappCardClass('rewardBalance')}>
      <div className="flex items-center justify-between gap-3">
        <DappSkeleton className="h-3 w-24" />
        <DappSkeleton className="h-3 w-16" />
      </div>
      <DappSkeleton className="mt-2 h-7 w-[42%]" />
      <DappSkeleton className="mt-1.5 h-3 w-[78%]" />
    </article>
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
        <DappSkeleton className="h-[7px] w-full rounded-full" />
      </div>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <DappSkeleton className="h-3 w-20" />
          <DappSkeleton className="h-3 w-24" />
        </div>
        <DappSkeleton className="h-[7px] w-full rounded-full" />
      </div>
    </div>
  )
}

export function CommunityStatCardSkeleton({ dark = false }: { dark?: boolean }) {
  const tone = dark ? 'dark' : 'surface'

  return (
    <article
      className={dappCardClass('communityStat', {
        tone: dark ? 'dark' : 'surface',
        className: cn(
          'min-h-[90px] rounded-[14px] border-0 p-[13px_12px] shadow-card',
          dark && 'is-dark',
        ),
      })}
    >
      <DappSkeleton className="h-3 w-16" tone={tone} />
      <DappSkeleton className="mt-2 h-7 w-14" tone={tone} />
      <DappSkeleton className="mt-1 h-3 w-24" tone={tone} />
      <DappSkeleton className="mt-1 h-3 w-32" tone={tone} />
    </article>
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
        <td
          className={cn(dappLayout.tableCell, isLast && 'border-b-0')}
          key={index}
        >
          <DappSkeleton className="h-3.5 w-[min(100%,88px)]" />
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
        <DappSkeleton className="h-[7px] w-full rounded-full" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-0 border-collapse text-[13px] leading-[1.5]">
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
  return <DappSkeleton className="inline-block h-3 w-[88px]" />
}

export function SwapMetaValueSkeleton({ className }: { className?: string }) {
  return <DappSkeleton className={cn('inline-block h-3.5 w-[min(100%,148px)]', className)} />
}

export function SwapAmountSkeleton() {
  return <DappSkeleton className="ml-auto h-7 w-[108px] max-w-[55%]" />
}

export function GenesisPromoBodySkeleton() {
  return <DappSkeleton className="h-3 w-[82%]" tone="dark" />
}
