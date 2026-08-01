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
      <div
        className="exchange-view-layer exchange-view-layer-exit"
        data-exchange-direction={direction}
      >
        <div className="exchange-view-layer-motion">
          <DappSubviewDisplayViewContext.Provider value={outgoing}>
            {children}
          </DappSubviewDisplayViewContext.Provider>
        </div>
      </div>
      <div
        className="exchange-view-layer exchange-view-layer-enter"
        data-exchange-direction={direction}
      >
        <div className="exchange-view-layer-motion">
          <DappSubviewDisplayViewContext.Provider value={incoming}>
            {children}
          </DappSubviewDisplayViewContext.Provider>
        </div>
      </div>
    </>
  )
}
