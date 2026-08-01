import type { ReactNode } from 'react'

import { DappPanelHeader } from '~/app/shell/dapp-panel-header'
import { cn } from '~/shared/lib/utils'
import { useDappShellStore } from '~/stores/dapp-shell-store'

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
        // PC: fill remaining column height; H5: hug content (shell window scrolls)
        'dapp:min-h-0 dapp:flex-1 dapp:*:shrink-0',
        'max-dapp:min-h-0 max-dapp:flex-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

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
