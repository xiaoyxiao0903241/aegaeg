import type { ReactNode } from 'react'
import type { DappViewDirection } from '~/stores/create-dapp-subview-store'
import { DappSubviewDisplayViewContext } from '~/app/shell/dapp-subview-display-context'

/** Shared hub↔subview enter/exit layers — children read view from display context. */
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
