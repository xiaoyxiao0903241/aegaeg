import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

type RewardsStatCardProps = {
  label: ReactNode
  value?: ReactNode
  hint?: ReactNode
  className?: string
  labelClassName?: string
  children?: ReactNode
}

/** Local rewards chrome — Card elevated + Figma pad/radius via className. */
export function RewardsStatCard({
  label,
  value,
  hint,
  className,
  labelClassName,
  children,
}: RewardsStatCardProps) {
  return (
    <Card as="div" surface="elevated" className={cn('rounded-2xl p-4 shadow-sm', className)}>
      {children ?? (
        <>
          <Text as="p" className={labelClassName} tone="muted-foreground" variant="caption">
            {label}
          </Text>
          {value != null ? (
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {value}
            </Text>
          ) : null}
          {hint != null ? (
            <Text as="p" className="mt-1 text-[13px]" tone="muted-foreground" variant="detail">
              {hint}
            </Text>
          ) : null}
        </>
      )}
    </Card>
  )
}
