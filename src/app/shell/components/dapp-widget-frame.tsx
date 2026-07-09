import type { ReactNode } from 'react'
import { DappPanelHeader } from '~/app/shell/components/dapp-panel-header'
import { shellWidgetRootClass } from '~/app/shell-layout'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { cn } from '~/shared/lib/utils'

/** Left-column card stack — gap 8; first child clears top margin. */
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
        'flex min-h-0 flex-1 flex-col gap-2',
        '[&>*:first-child]:!mt-0 max-dapp:[&>*:first-child]:!mt-0',
        'dapp:[&>*]:shrink-0',
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
  frameClass = shellWidgetRootClass,
  showToggle = true,
  subtitle,
  title,
}: {
  bodyClassName?: string
  children: ReactNode
  className?: string
  frameClass?: string
  showToggle?: boolean
  subtitle: ReactNode
  title: string
}) {
  const collapsed = useDappShellStore((state) => state.detailCollapsed)
  const onToggle = useDappShellStore((state) => state.toggleDetailCollapsed)

  return (
    <div className={cn(frameClass, className)}>
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
