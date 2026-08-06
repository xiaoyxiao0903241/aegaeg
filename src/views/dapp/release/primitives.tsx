/**
 * 释放计划卡（组合组件）
 *
 * 顶栏代币徽标 + 刷新、已释放/释放中、进度条、脚注与领取按钮。
 * 释放队列各档与缓冲池 AGX/gAGX 共用。
 */
import { RefreshCw } from 'lucide-react'
import { type ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { Icon } from '~/shared/components/icon'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

function Root({
  children,
  className,
  'data-slot-id': dataSlotId,
}: {
  children: ReactNode
  className?: string
  'data-slot-id'?: string
}) {
  return (
    <Card
      className={cn('rounded-2xl p-4 shadow-none', className)}
      data-slot-id={dataSlotId}
      surface="outlined"
    >
      <Card.Content className="grid gap-3">{children}</Card.Content>
    </Card>
  )
}

function Header({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-2">{children}</div>
}

function Token({ iconSrc, label }: { iconSrc: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon alt="" className="size-(--app-icon-xl) shrink-0 rounded-md" size="xl" src={iconSrc} />
      <Text
        as="span"
        className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 leading-none font-semibold text-foreground/70"
        variant="support"
      >
        {label}
      </Text>
    </div>
  )
}

function Refresh({
  busy,
  disabled,
  label,
  onClick,
  'data-slot-id': dataSlotId,
}: {
  busy?: boolean
  disabled?: boolean
  label: string
  onClick?: () => void
  'data-slot-id'?: string
}) {
  return (
    <button
      aria-busy={busy}
      aria-label={label}
      className="grid size-6 shrink-0 place-items-center bg-transparent text-foreground/40 transition-colors hover:text-foreground disabled:opacity-60"
      data-slot-id={dataSlotId}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <RefreshCw aria-hidden className={cn('size-4', busy && 'animate-spin')} strokeWidth={2} />
    </button>
  )
}

function Metrics({
  releasedLabel,
  releasedValue,
  releasingLabel,
  releasingValue,
}: {
  releasedLabel: string
  releasedValue: string
  releasingLabel: string
  releasingValue: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <Text as="span" className="text-foreground/40" variant="copy">
          {releasedLabel}
        </Text>
        <Text as="span" className="font-semibold text-primary" variant="copy">
          {releasedValue}
        </Text>
      </div>
      <div className="flex items-center gap-1">
        <Text as="span" className="text-foreground/40" variant="copy">
          {releasingLabel}
        </Text>
        <Text as="span" className="font-semibold text-foreground" variant="copy">
          {releasingValue}
        </Text>
      </div>
    </div>
  )
}

function Bar({ width, 'data-slot-id': dataSlotId }: { width: string; 'data-slot-id'?: string }) {
  return (
    <div className="overflow-hidden rounded-full bg-muted" data-slot-id={dataSlotId}>
      <div className="rounded-full bg-primary" style={{ width }} />
    </div>
  )
}

function Captions({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between gap-2">
      <Text as="span" className="text-foreground/40" variant="support">
        {left}
      </Text>
      <Text as="span" className="text-foreground/40" variant="support">
        {right}
      </Text>
    </div>
  )
}

function Action({
  children,
  disabled,
  loading,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}) {
  return (
    <MainButton
      density="card"
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      type="button"
    >
      {children}
    </MainButton>
  )
}

export const ReleasePlanCard = Object.assign(Root, {
  Header,
  Token,
  Refresh,
  Metrics,
  Bar,
  Captions,
  Action,
})
