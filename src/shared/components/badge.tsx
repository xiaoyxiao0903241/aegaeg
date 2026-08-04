import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

type StatusBadgeTone = 'pending' | 'muted' | 'processing' | 'success' | 'failed'

const statusBadge = tv({
  base: 'inline-flex items-center rounded-full px-2.5 py-0.75 leading-none font-medium not-italic',
  variants: {
    tone: {
      /** 稿 待领取 · coral-soft + coral */
      pending: 'bg-primary-soft text-primary',
      /** 稿 已领取 · muted 底 + 40% 字 */
      muted: 'bg-muted text-foreground/40',
      processing: 'bg-primary-soft text-primary',
      success: 'bg-status-success-bg text-success',
      failed: 'bg-muted text-destructive',
    },
  },
  defaultVariants: {
    tone: 'success',
  },
})

/**
 * 表内状态 pill。默认 success 兼容旧调用；奖励日志用 pending/muted。
 * 字阶走 Text `support`（12）——禁任意 text-[Npx]。
 */
export function StatusBadge({
  children,
  className,
  tone = 'success',
}: {
  children: ReactNode
  className?: string
  tone?: StatusBadgeTone
}) {
  return (
    <Text as="span" className={cn(statusBadge({ tone }), className)} variant="support">
      {children}
    </Text>
  )
}
