import type { ReactNode } from 'react'
import { DappPanelHeader } from '~/app/components/dapp-panel-header'
import { shellWidgetRootClass } from '~/app/shell-layout'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { cn } from '~/lib/utils'

export function DappWidgetFrame({
  children,
  className,
  frameClass = shellWidgetRootClass,
  showToggle = true,
  subtitle,
  title,
}: {
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
        detailCollapsed={collapsed}
        onTogglePanel={onToggle}
        showToggle={showToggle}
        subtitle={subtitle}
        title={title}
      />
      {children}
    </div>
  )
}
