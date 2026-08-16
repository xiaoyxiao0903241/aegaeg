import { type ReactNode, useLayoutEffect, useRef } from 'react'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { cn } from '~/shared/lib/utils'
import { type DappSubviewMotion } from '~/stores/create-dapp-subview-store'
import { SubviewViewContext } from '~/views/dapp/shared/subview-context'

export { useSubviewView } from '~/views/dapp/shared/subview-context'

/** 中心页与子视图切换共用的叠层网格（每个 DApp Tab 面板都使用）。 */
export const DAPP_SUBVIEW_TRANSITION_STACK =
  'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0'

type SubviewHostProps = {
  subview: DappSubviewMotion
  className?: string
  /** 过渡期使用的网格样式，默认 {@link DAPP_SUBVIEW_TRANSITION_STACK}。 */
  transitionClassName?: string
  /** DOM 标记：widget=左侧操作区 · detail=右侧详情区。 */
  panel: 'widget' | 'detail'
  children: ReactNode
}

/**
 * 子视图展示外壳。
 *
 * 入场 / 静止共用同一棵 live 树（只改 context 与 CSS class）；
 * 过渡结束只卸退场层，避免入场树重挂导致 CountValue 再滚一遍。
 *
 * H5 左栏：过渡期锁退场高度，避免双层叠放 / 入场变矮时整窗跳动。
 */
export function SubviewHost({
  subview,
  className,
  transitionClassName = DAPP_SUBVIEW_TRANSITION_STACK,
  panel,
  children,
}: SubviewHostProps) {
  const { view, motion, direction, outgoingView, incomingView } = subview
  const isTransitioning = Boolean(motion && outgoingView && incomingView)
  const liveView = isTransitioning && incomingView ? incomingView : view
  const isMobile = useMobileViewport()
  const rootRef = useRef<HTMLDivElement>(null)
  const idleHeightRef = useRef(0)

  // 过渡期直接写 DOM 高度（paint 前）；避免 render 读 ref / layout effect setState。
  useLayoutEffect(() => {
    const node = rootRef.current
    if (!node || panel !== 'widget' || !isMobile) {
      if (node) {
        node.style.height = ''
        node.style.overflow = ''
      }
      return
    }
    if (!isTransitioning) {
      idleHeightRef.current = node.offsetHeight
      node.style.height = ''
      node.style.overflow = ''
      return
    }
    const next = idleHeightRef.current
    if (next > 0) {
      node.style.height = `${next}px`
      node.style.overflow = 'hidden'
    }
  }, [isMobile, isTransitioning, panel, liveView])

  return (
    <div
      ref={rootRef}
      className={cn(className, isTransitioning && transitionClassName)}
      data-dapp-detail-panel={panel === 'detail' ? '' : undefined}
      data-dapp-transitioning={isTransitioning ? 'true' : undefined}
      data-dapp-widget-panel={panel === 'widget' ? '' : undefined}
    >
      {isTransitioning && outgoingView ? (
        <div className="dapp-subview-layer dapp-subview-layer-exit" data-dapp-direction={direction}>
          <div className="dapp-subview-layer-motion">
            <SubviewViewContext.Provider value={outgoingView}>
              {children}
            </SubviewViewContext.Provider>
          </div>
        </div>
      ) : null}

      <div
        className={
          isTransitioning
            ? 'dapp-subview-layer dapp-subview-layer-enter'
            : 'flex min-h-0 min-w-0 flex-1 flex-col dapp:h-full'
        }
        data-dapp-direction={isTransitioning ? direction : undefined}
      >
        <div
          className={
            isTransitioning
              ? 'dapp-subview-layer-motion'
              : // idle 清掉 enter 的 animation fill（both），避免残留 transform
                'flex min-h-0 min-w-0 flex-1 transform-none flex-col opacity-[1] dapp:h-full'
          }
        >
          <SubviewViewContext.Provider value={liveView}>{children}</SubviewViewContext.Provider>
        </div>
      </div>
    </div>
  )
}
