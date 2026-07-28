import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/** Left-column outlined card (`p-3.5` / `rounded-md`); stack gap defaults to `gap-2`. */
export function DappSideCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(revealClass(), 'flex flex-col gap-2', className)}
      data-reveal
    >
      {children}
    </Card>
  )
}

export function RewardBalanceCard({
  action,
  badge,
  badgeClassName,
  className,
  headerLabelClassName,
  headerMetaClassName,
  hint,
  hintClassName,
  label,
  meta,
  value,
  valueClassName,
}: {
  action?: ReactNode
  badge?: ReactNode
  className?: string
  headerLabelClassName?: string
  headerMetaClassName?: string
  badgeClassName?: string
  hint?: ReactNode
  hintClassName?: string
  label: ReactNode
  meta?: ReactNode
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <Card
      as="article"
      surface="outlined"
      className={cn(revealClass(), 'text-muted-foreground', className)}
      data-reveal
    >
      <Card.Header className="flex-row items-center justify-between gap-3">
        <Card.Label as="p" tone="muted-foreground" className={cn('m-0', headerLabelClassName)}>
          {label}
        </Card.Label>
        {meta ? (
          <Card.Label as="span" tone="muted-foreground" className={cn(headerMetaClassName)}>
            {meta}
          </Card.Label>
        ) : (
          <Card.Label
            as="span"
            tone="success"
            className={cn('font-medium whitespace-nowrap', badgeClassName)}
          >
            {badge}
          </Card.Label>
        )}
      </Card.Header>
      {/* Default: text-lg；H5 走 Text variant token；referral 用 figure 覆盖 */}
      <Card.Value className={cn('mt-2 text-lg leading-[1.3]', valueClassName)}>{value}</Card.Value>
      {hint ? (
        <Card.Description
          as="small"
          className={cn('mt-1.5 block max-w-full whitespace-nowrap', hintClassName)}
        >
          {hint}
        </Card.Description>
      ) : null}
      {action}
    </Card>
  )
}
