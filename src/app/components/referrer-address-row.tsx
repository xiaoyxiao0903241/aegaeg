import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export function ReferrerAddressRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-[46px] items-center justify-between rounded-[11px] bg-background px-[14px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
