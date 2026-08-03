import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

type RewardsStatCardProps = {
  label: ReactNode
  value?: ReactNode
  hint?: ReactNode
  className?: string
  labelClassName?: string
  children?: ReactNode
}

/** Local rewards chrome — elevated = shadow-card(e2) · Figma tile 74×p16×r16。 */
export function RewardsStatCard({
  label,
  value,
  hint,
  className,
  labelClassName,
  children,
}: RewardsStatCardProps) {
  return (
    <Card
      as="div"
      surface="elevated"
      // Figma tile 74：h-18.5 + p-4（禁 min-h-[74px]；定高防 leading 撑破；勿再盖 shadow-sm）
      className={cn('h-18.5 gap-1.5 overflow-hidden rounded-2xl p-4', className)}
    >
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
            <Text as="p" className="mt-1" tone="muted-foreground" variant="detail">
              {hint}
            </Text>
          ) : null}
        </>
      )}
    </Card>
  )
}
