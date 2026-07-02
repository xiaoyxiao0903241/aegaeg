import type { ReactNode } from 'react'
import { DappPanelHeader } from '~/app/components/dapp-panel-header'
import { shellWidgetRootClass } from '~/app/shell-layout'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { cn } from '~/lib/utils'

/** Figma widget column — header to first block: PC 14px, H5 30px; card stack gap 8px. */
export const dappWidgetHeaderSpacingClass = 'mb-3.5 max-dapp:mb-7.5'

export const dappWidgetBodyClass = cn(
  'flex min-h-0 flex-1 flex-col gap-2',
  '[&>*:first-child]:!mt-0 max-dapp:[&>*:first-child]:!mt-0',
  'dapp:[&>*]:shrink-0',
)

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
        className={dappWidgetHeaderSpacingClass}
        detailCollapsed={collapsed}
        onTogglePanel={onToggle}
        showToggle={showToggle}
        subtitle={subtitle}
        title={title}
      />
      <div className={cn(dappWidgetBodyClass, bodyClassName)}>{children}</div>
    </div>
  )
}
