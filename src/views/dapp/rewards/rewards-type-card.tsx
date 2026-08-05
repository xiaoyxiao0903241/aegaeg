/**
 * 奖励类型入口卡（组合式）
 *
 * 壳管可点行为；标题 / 说明 / 余额由调用方用子件组装。
 */
import { type ReactNode } from 'react'

import { CountValue } from '~/shared/components/count-value'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Text } from '~/shared/components/text'

function Root({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <InteractiveCard className="grid gap-3" onClick={onClick}>
      {children}
    </InteractiveCard>
  )
}

function Head({ children }: { children: ReactNode }) {
  return <div className="grid gap-1.5">{children}</div>
}

function TitleRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-1.5">{children}</div>
}

function Body({ children }: { children: ReactNode }) {
  return (
    <Text as="p" className="m-0 wrap-break-word text-foreground/40" variant="copy">
      {children}
    </Text>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary-soft px-2">
      <Text as="span" className="leading-none" tone="primary" variant="caption">
        {children}
      </Text>
    </span>
  )
}

function Balance({
  label,
  amount,
  approx,
  trailing,
}: {
  label: string
  amount: string
  approx?: string
  trailing?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
      <Text as="span" className="text-foreground/70" variant="copy">
        {label}
      </Text>
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
        <Text as="strong" className="wrap-break-word" variant="headline">
          <CountValue text={amount} />
        </Text>
        {approx ? (
          <Text as="span" className="wrap-break-word text-foreground/40" variant="copy">
            <CountValue text={approx} />
          </Text>
        ) : null}
        {trailing}
      </div>
    </div>
  )
}

export const RewardsTypeCard = Object.assign(Root, {
  Head,
  TitleRow,
  Body,
  Badge,
  Balance,
})
