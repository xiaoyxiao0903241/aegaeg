import type { ReactNode } from 'react'

import { DappSubviewDisplayViewContext } from '~/app/shell/dapp-subview-display-context'
import { DappSubviewTransitionLayers } from '~/app/shell/dapp-subview-transition-layers'
import { cn } from '~/shared/lib/utils'
import { type DappSubviewMotion } from '~/stores/create-dapp-subview-store'

export { useDappSubviewDisplayView } from '~/app/shell/dapp-subview-display-context'

/** 中心页与子视图切换共用的交叉淡入网格（每个 DApp Tab 面板都使用）。 */
export const DAPP_SUBVIEW_TRANSITION_STACK =
  'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0'

type DappSubviewShellProps = {
  subview: DappSubviewMotion
  className?: string
  /** 过渡期使用的网格样式，默认 {@link DAPP_SUBVIEW_TRANSITION_STACK}。 */
  transitionClassName?: string
  /** DOM 标记：widget=左侧操作区 · detail=右侧详情区。 */
  panel: 'widget' | 'detail'
  children: ReactNode
}

/**
 * 子视图展示外壳：接收动画状态，把视图内容作为子节点渲染。
 *
 * 静止时直接提供当前视图；过渡期间拆成退场 / 入场两层，
 * 子组件通过 display context 读取各自应展示的视图。
 */
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
