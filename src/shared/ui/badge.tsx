import type { ReactNode } from 'react'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

export function StatusBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Text
      as="span"
      variant="copy"
      tone="success"
      className={cn(
        'inline-flex items-center rounded-full bg-status-success-bg px-2 py-0.5 not-italic',
        className,
      )}
    >
      {children}
    </Text>
  )
}
