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

/**
 * 奖励右栏瓦 — elevated e2 · 稿高约 74 作 **min**（禁定高 + overflow 裁切正文 / CTA）。
 */
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
      className={cn('min-h-18.5 gap-1.5 overflow-visible rounded-2xl p-4', className)}
    >
      {children ?? (
        <>
          <Text as="p" className={labelClassName} tone="muted-foreground" variant="caption">
            {label}
          </Text>
          {value != null ? (
            <Text as="p" className="mt-1.5 font-semibold wrap-break-word" variant="copy">
              {value}
            </Text>
          ) : null}
          {hint != null ? (
            <Text as="p" className="mt-1 wrap-break-word" tone="muted-foreground" variant="detail">
              {hint}
            </Text>
          ) : null}
        </>
      )}
    </Card>
  )
}
