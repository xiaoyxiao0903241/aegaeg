import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/**
 * Left-column (wcol) outlined card — padding/radius from Card `outlined` SSOT (`p-3.5` / `rounded-md`).
 * Do not re-apply `px-4 py-3.5` at call sites; stack gap stays `gap-2` unless layout needs `gap-*` override.
 */
export function DappSideCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
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
        <Card.Label
          as="p"
          tone="muted-foreground"
          className={cn('m-0 text-xs font-normal', headerLabelClassName)}
        >
          {label}
        </Card.Label>
        {meta ? (
          <Card.Label
            as="span"
            tone="muted-foreground"
            className={cn('text-xs font-normal', headerMetaClassName)}
          >
            {meta}
          </Card.Label>
        ) : (
          <Card.Label
            as="span"
            tone="success"
            className={cn('whitespace-nowrap text-xs font-medium', badgeClassName)}
          >
            {badge}
          </Card.Label>
        )}
      </Card.Header>
      {/* Default: text-lg；H5 text-xs；referral 用 figure 覆盖 */}
      <Card.Value
        className={cn('mt-2 text-lg font-semibold leading-[1.3] max-dapp:text-xs', valueClassName)}
      >
        {value}
      </Card.Value>
      {hint ? (
        <Card.Description
          as="small"
          className={cn('mt-1.5 block max-w-full whitespace-nowrap text-xs', hintClassName)}
        >
          {hint}
        </Card.Description>
      ) : null}
      {action}
    </Card>
  )
}
