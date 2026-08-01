import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

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
