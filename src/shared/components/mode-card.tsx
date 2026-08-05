/**
 * Hub 左栏同骨架模式入口卡（组合式）
 *
 * 用于 exchange / staking 等「图标 + 标题 + 一行说明」入口；
 * Assets（双列指标）与业务具名卡勿硬套本壳。
 */
import { type ComponentProps, type ReactNode } from 'react'

import { Icon } from '~/shared/components/icon'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

function Root({
  children,
  className,
  ...props
}: ComponentProps<typeof InteractiveCard> & { children: ReactNode }) {
  return (
    <InteractiveCard className={cn('flex items-center gap-3', className)} {...props}>
      {children}
    </InteractiveCard>
  )
}

function ModeIcon({ src }: { src: string }) {
  return <Icon alt="" size="xl" src={src} />
}

function Title({ children }: { children: ReactNode }) {
  return (
    <Text as="span" className="font-semibold" variant="detail">
      {children}
    </Text>
  )
}

function Body({ children }: { children: ReactNode }) {
  return (
    <Text as="p" className="m-0 text-foreground/40" variant="copy">
      {children}
    </Text>
  )
}

function Copy({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid min-w-0 flex-1 gap-1.5', className)}>{children}</div>
}

export const ModeCard = Object.assign(Root, {
  Icon: ModeIcon,
  Copy,
  Title,
  Body,
})
