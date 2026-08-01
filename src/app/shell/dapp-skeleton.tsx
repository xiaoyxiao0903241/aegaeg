import { tv } from 'tailwind-variants'

import { dappTableCell } from '~/app/shell/dapp-table-card'
import { cn } from '~/shared/lib/utils'

/** Mobile community stat shell — shared by live cards (≥2 call sites → shell). */
export const communityStatCardMobileShell = tv({
  base: cn(
    'max-dapp:min-h-22 max-dapp:items-start max-dapp:rounded-md max-dapp:border-0',
    'max-dapp:p-(--dapp-community-stat-padding) max-dapp:text-left max-dapp:shadow-card',
  ),
})

const dappSkeleton = tv({
  base: ['block rounded-md', 'motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'],
  variants: {
    tone: {
      surface: 'bg-skeleton',
      dark: 'bg-skeleton-on-dark',
    },
  },
  defaultVariants: {
    tone: 'surface',
  },
})

const tableCell = dappTableCell()
const tableRowSkeletonCell = tv({
  base: [
    tableCell.border(),
    tableCell.minWidth(),
    'px-3 py-2.5 text-left font-normal whitespace-nowrap max-dapp:px-2.5 max-dapp:py-2',
  ],
  variants: {
    last: {
      true: 'border-b-0',
      false: '',
    },
  },
})

export function DappSkeleton({
  className,
  tone = 'surface',
}: {
  className?: string
  tone?: 'dark' | 'surface'
}) {
  return <span aria-hidden="true" className={dappSkeleton({ tone, class: className })} />
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
        <td className={tableRowSkeletonCell({ last: isLast })} key={index}>
          <DappSkeleton className="h-3.5 w-full max-w-22" />
        </td>
      ))}
    </tr>
  )
}
