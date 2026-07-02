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
        'flex h-11 items-center justify-between rounded-sm bg-background px-3.5',
        className,
      )}
    >
      {children}
    </div>
  )
}
