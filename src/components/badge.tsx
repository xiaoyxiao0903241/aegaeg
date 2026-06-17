import type { ReactNode } from 'react'
import { Text } from '~/components/text'
import { cn } from '~/lib/utils'

export function StatusBadge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Text
      as="span"
      size="xs"
      weight="bold"
      tone="success"
      className={cn(
        'inline-flex items-center rounded-full bg-status-success-bg px-[9px] py-0.5 not-italic',
        className,
      )}
    >
      {children}
    </Text>
  )
}
