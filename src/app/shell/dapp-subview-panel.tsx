import type { ReactNode } from 'react'
import { cn } from '~/shared/lib/utils'
import { type DappSubviewMotion } from '~/stores/create-dapp-subview-store'
import { DappSubviewDisplayViewContext } from '~/app/shell/dapp-subview-display-context'
import { DappSubviewTransitionLayers } from '~/app/shell/dapp-subview-transition-layers'

export { useDappSubviewDisplayView } from '~/app/shell/dapp-subview-display-context'

/** Shared hub↔subview crossfade grid — used by every DApp tab shell. */
export const DAPP_SUBVIEW_TRANSITION_STACK =
  'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0'

type DappSubviewShellProps = {
  subview: DappSubviewMotion
  className?: string
  /** Defaults to {@link DAPP_SUBVIEW_TRANSITION_STACK}. */
  transitionClassName?: string
  /** DOM marker: widget vs detail panel. */
  panel: 'widget' | 'detail'
  children: ReactNode
}

/** Presentational shell — motion data in, view body as children (via display context). */
export function DappSubviewShell({
  subview,
  className,
  transitionClassName = DAPP_SUBVIEW_TRANSITION_STACK,
  panel,
  children,
}: DappSubviewShellProps) {
  const { view, motion, direction, outgoingView, incomingView } = subview
  const isTransitioning = Boolean(motion && outgoingView && incomingView)

  return (
    <div
      className={cn(className, isTransitioning && transitionClassName)}
      data-dapp-detail-panel={panel === 'detail' ? '' : undefined}
      data-dapp-transitioning={isTransitioning ? 'true' : undefined}
      data-dapp-widget-panel={panel === 'widget' ? '' : undefined}
    >
      {isTransitioning && outgoingView && incomingView ? (
        <DappSubviewTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
        >
          {children}
        </DappSubviewTransitionLayers>
      ) : (
        <DappSubviewDisplayViewContext.Provider value={view}>
          {children}
        </DappSubviewDisplayViewContext.Provider>
      )}
    </div>
  )
}
