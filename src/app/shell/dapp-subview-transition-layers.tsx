import type { ReactNode } from 'react'

import { DappSubviewDisplayViewContext } from '~/app/shell/dapp-subview-display-context'
import type { DappViewDirection } from '~/stores/create-dapp-subview-store'

/**
 * 子视图切换时的退场 / 入场两层。
 *
 * 各层通过 display context 注入自己的视图名，子组件据此渲染对应内容；
 * 两层叠放后由 CSS 动画驱动交叉淡入淡出。
 */
export function DappSubviewTransitionLayers({
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
          <DappSubviewDisplayViewContext.Provider value={outgoing}>
            {children}
          </DappSubviewDisplayViewContext.Provider>
        </div>
      </div>
      <div className="dapp-subview-layer dapp-subview-layer-enter" data-dapp-direction={direction}>
        <div className="dapp-subview-layer-motion">
          <DappSubviewDisplayViewContext.Provider value={incoming}>
            {children}
          </DappSubviewDisplayViewContext.Provider>
        </div>
      </div>
    </>
  )
}
