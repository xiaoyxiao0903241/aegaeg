import type { ReactNode } from 'react'

import type { DappViewDirection } from '~/stores/create-dapp-subview-store'
import { SubviewViewContext } from '~/views/dapp/shared/subview-context'

/**
 * 子视图切换时的退场 / 入场两层。
 *
 * 各层通过 display context 注入自己的视图名，子组件据此渲染对应内容；
 * 两层叠放后由 CSS 动画驱动（左栏整层横滑 / 右栏升降淡）。
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
          <SubviewViewContext.Provider value={outgoing}>{children}</SubviewViewContext.Provider>
        </div>
      </div>
      <div className="dapp-subview-layer dapp-subview-layer-enter" data-dapp-direction={direction}>
        <div className="dapp-subview-layer-motion">
          <SubviewViewContext.Provider value={incoming}>{children}</SubviewViewContext.Provider>
        </div>
      </div>
    </>
  )
}
