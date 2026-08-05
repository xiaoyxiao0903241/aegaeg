import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

type StatusBadgeTone = 'pending' | 'muted' | 'success' | 'failed'

const statusBadge = tv({
  base: 'inline-flex items-center rounded-full leading-none font-medium not-italic',
  variants: {
    tone: {
      /** 待领取 / 处理中：浅珊瑚底 + 珊瑚字（稿无差，合并原 processing） */
      pending: 'bg-accent text-primary',
      /** 已领取：灰底 + 次要文字色 */
      muted: 'bg-muted text-foreground/40',
      success: 'bg-status-success-bg text-success',
      failed: 'bg-muted text-destructive',
    },
    size: {
      default: 'px-2.5 py-0.75',
      compact: 'px-2 py-0.5',
    },
  },
  defaultVariants: {
    tone: 'success',
    size: 'default',
  },
})

/**
 * 表格内的状态胶囊
 *
 * 默认 success 兼容旧调用；奖励日志用 pending / muted。
 * `processing` 已并入 `pending`（样式一致）。
 */
export function StatusBadge({
  children,
  className,
  tone = 'success',
  size = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: StatusBadgeTone
  size?: 'default' | 'compact'
}) {
  return (
    <Text as="span" className={cn(statusBadge({ tone, size }), className)} variant="support">
      {children}
    </Text>
  )
}
