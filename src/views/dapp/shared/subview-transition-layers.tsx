import type { ReactNode } from 'react'

import type { DappViewDirection } from '~/stores/create-dapp-subview-store'
import { SubviewDisplayViewContext } from '~/views/dapp/shared/subview-display-context'

/**
 * 子视图切换时的退场 / 入场两层。
 *
 * 各层通过 display context 注入自己的视图名，子组件据此渲染对应内容；
 * 两层叠放后由 CSS 动画驱动交叉淡入淡出。
 */
export function SubviewTransitionLayers({
  direction,
  incoming,
  outgoing,
  children,
}: {
  direction: DappViewDirection
  incoming: string
  outgoing: string
  children: ReactNode
}) {
  return (
    <>
      <div className="dapp-subview-layer dapp-subview-layer-exit" data-dapp-direction={direction}>
        <div className="dapp-subview-layer-motion">
          <SubviewDisplayViewContext.Provider value={outgoing}>
            {children}
          </SubviewDisplayViewContext.Provider>
        </div>
      </div>
      <div className="dapp-subview-layer dapp-subview-layer-enter" data-dapp-direction={direction}>
        <div className="dapp-subview-layer-motion">
          <SubviewDisplayViewContext.Provider value={incoming}>
            {children}
          </SubviewDisplayViewContext.Provider>
        </div>
      </div>
    </>
  )
}
