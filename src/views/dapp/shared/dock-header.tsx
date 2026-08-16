import type { ReactNode } from 'react'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { DetailToggle } from '~/views/dapp/shared/detail-toggle'

/**
 * Hub 顶栏：标题 / 描述 + 右侧操作按钮。
 *
 * title 20 / caption 13、块内 gap 6；右侧主图标 + 可选第二图标 gap 8；垂直居中。
 */
export function DockHeader({
  className,
  endAction,
  showToggle = true,
  subtitle,
  title,
  titleClassName,
}: {
  className?: string
  endAction?: ReactNode
  showToggle?: boolean
  subtitle: ReactNode
  title: ReactNode
  titleClassName?: string
}) {
  return (
    <div className={cn('flex w-full items-center justify-between gap-4', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Text as="h1" variant="panel" className={cn('m-0', titleClassName)}>
          {title}
        </Text>
        <Text
          as="p"
          variant="support"
          tone="muted-foreground"
          className="m-0 max-dapp:max-w-none [&_strong]:font-bold [&_strong]:text-primary"
        >
          {subtitle}
        </Text>
      </div>
      {endAction || showToggle ? (
        <div className="flex shrink-0 items-center gap-2">
          {endAction}
          {showToggle ? <DetailToggle /> : null}
        </div>
      ) : null}
    </div>
  )
}
