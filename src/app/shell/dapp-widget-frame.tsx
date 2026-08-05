import type { ReactNode } from 'react'

import { DappPanelHeader } from '~/app/shell/dapp-panel-header'
import { cn } from '~/shared/lib/utils'
import { useDappShellStore } from '~/stores/dapp-shell-store'

/** 操作区纵向堆叠容器：PC 撑满剩余列高，H5 按内容定高。 */
export function DappWidgetStack({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        '[&>*:first-child]:mt-0! max-dapp:[&>*:first-child]:mt-0!',
        // PC：撑满剩余列高；H5：按内容定高（外层窗口负责滚动）
        'dapp:min-h-0 dapp:flex-1 dapp:*:shrink-0',
        'max-dapp:min-h-0 max-dapp:flex-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * 操作区面板框架：标题区 + 纵向堆叠的内容区。
 *
 * 标题区带折叠右侧详情面板的开关，状态读写 dapp-shell-store。
 */
export function DappWidgetFrame({
  bodyClassName,
  children,
  className,
  showToggle = true,
  subtitle,
  title,
}: {
  bodyClassName?: string
  children: ReactNode
  className?: string
  showToggle?: boolean
  subtitle: ReactNode
  title: string
}) {
  const collapsed = useDappShellStore((state) => state.detailCollapsed)
  const onToggle = useDappShellStore((state) => state.toggleDetailCollapsed)

  return (
    <div className={cn('flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0', className)}>
      <DappPanelHeader
        className="mb-3.5 max-dapp:mb-7.5"
        detailCollapsed={collapsed}
        onTogglePanel={onToggle}
        showToggle={showToggle}
        subtitle={subtitle}
        title={title}
      />
      <DappWidgetStack className={bodyClassName}>{children}</DappWidgetStack>
    </div>
  )
}
