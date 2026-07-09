import type { ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

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

export function DappReferrerBoundCard({
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
      className={cn(revealClass(), 'flex flex-col gap-2.5 p-4', className)}
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
          className={cn(
            // 4175: text-xs（H5 bump→13）；禁 text-[12px] 锁死
            'm-0 text-xs font-normal leading-[1.5] tracking-[-0.24px]',
            headerLabelClassName,
          )}
        >
          {label}
        </Card.Label>
        {meta ? (
          <Card.Label
            as="span"
            tone="muted-foreground"
            className={cn(
              'text-xs font-normal leading-[1.5] tracking-[-0.24px]',
              headerMetaClassName,
            )}
          >
            {meta}
          </Card.Label>
        ) : (
          <Card.Label
            as="span"
            tone="success"
            className={cn(
              'whitespace-nowrap text-xs font-medium leading-[1.5] tracking-[-0.24px]',
              badgeClassName,
            )}
          >
            {badge}
          </Card.Label>
        )}
      </Card.Header>
      {/* Default matches 4175 text-lg/1.3；H5 text-xs ≡ 4175 max-dapp:text-xs；referral 用 figure 覆盖 */}
      <Card.Value
        className={cn(
          'mt-2 text-lg font-semibold leading-[1.3] tracking-[-0.54px] max-dapp:text-xs max-dapp:leading-[1.2] max-dapp:tracking-[-0.51px]',
          valueClassName,
        )}
      >
        {value}
      </Card.Value>
      {hint ? (
        <Card.Description
          as="small"
          className={cn(
            'mt-1.5 block max-w-full whitespace-nowrap text-xs leading-normal tracking-[-0.24px]',
            hintClassName,
          )}
        >
          {hint}
        </Card.Description>
      ) : null}
      {action}
    </Card>
  )
}
