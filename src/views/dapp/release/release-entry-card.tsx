/**
 * 释放入口卡（组合式）
 *
 * 释放队列 / 缓冲池总览入口：壳 + 标题行 + 主体子树。
 */
import { type ReactNode } from 'react'

import { CountValue } from '~/shared/components/count-value'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

function Root({
  children,
  className,
  onClick,
  'data-slot-id': dataSlotId,
}: {
  children: ReactNode
  className?: string
  onClick: () => void
  'data-slot-id'?: string
}) {
  return (
    <InteractiveCard
      className={cn('flex flex-col', className)}
      data-slot-id={dataSlotId}
      onClick={onClick}
    >
      {children}
    </InteractiveCard>
  )
}

function TitleRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>
}

function Title({ children }: { children: ReactNode }) {
  return (
    <Text as="span" className="min-w-0 flex-1 font-semibold" variant="detail">
      {children}
    </Text>
  )
}

function Percent({ value }: { value: string }) {
  return (
    <Text as="span" variant="detail">
      <CountValue text={value} />
    </Text>
  )
}

export const ReleaseEntryCard = Object.assign(Root, {
  TitleRow,
  Title,
  Percent,
})
