import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import { useAssetsViewStore, type AssetsView } from '~/stores/assets-view-store'
import { AssetsHubWidget } from '~/views/dapp/assets/hub/assets-hub-widget'
import { AssetsHubContent } from '~/views/dapp/assets/hub/assets-hub-content'
import { AssetsPositionWidget } from '~/views/dapp/assets/position/assets-position-widget'
import { AssetsPositionContent } from '~/views/dapp/assets/position/assets-position-content'
import { AssetsXmineWidget } from '~/views/dapp/assets/xmine/assets-xmine-widget'
import { AssetsXmineContent } from '~/views/dapp/assets/xmine/assets-xmine-content'

const assetsTransitionStack = tv({
  base: 'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0',
})

function renderAssetsWidget(displayView: AssetsView) {
  if (displayView === 'stake') return <AssetsPositionWidget product="stake" />
  if (displayView === 'lpbond') return <AssetsPositionWidget product="lpbond" />
  if (displayView === 'burnbond') return <AssetsPositionWidget product="burnbond" />
  if (displayView === 'xmine') return <AssetsXmineWidget />
  return <AssetsHubWidget />
}

function renderAssetsContent(displayView: AssetsView) {
  if (displayView === 'stake') return <AssetsPositionContent product="stake" />
  if (displayView === 'lpbond') return <AssetsPositionContent product="lpbond" />
  if (displayView === 'burnbond') return <AssetsPositionContent product="burnbond" />
  if (displayView === 'xmine') return <AssetsXmineContent />
  return <AssetsHubContent />
}

function AssetsTransitionLayers({
  direction,
  incoming,
  outgoing,
  render,
}: {
  direction: 'forward' | 'back'
  incoming: AssetsView
  outgoing: AssetsView
  render: (view: AssetsView) => ReactNode
}) {
  return (
    <>
      <div
        className="exchange-view-layer exchange-view-layer-exit"
        data-exchange-direction={direction}
      >
        <div className="exchange-view-layer-motion">{render(outgoing)}</div>
      </div>
      <div
        className="exchange-view-layer exchange-view-layer-enter"
        data-exchange-direction={direction}
      >
        <div className="exchange-view-layer-motion">{render(incoming)}</div>
      </div>
    </>
  )
}

export function AssetsWidget() {
  const view = useAssetsViewStore((state) => state.view)
  const motion = useAssetsViewStore((state) => state.motion)
  const direction = useAssetsViewStore((state) => state.direction)
  const outgoingView = useAssetsViewStore((state) => state.outgoingView)
  const incomingView = useAssetsViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn(
        'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0',
        isTransitioning && assetsTransitionStack(),
      )}
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
      data-exchange-widget-panel
    >
      {isTransitioning ? (
        <AssetsTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderAssetsWidget}
        />
      ) : (
        renderAssetsWidget(view)
      )}
    </div>
  )
}

export function AssetsContent() {
  const view = useAssetsViewStore((state) => state.view)
  const motion = useAssetsViewStore((state) => state.motion)
  const direction = useAssetsViewStore((state) => state.direction)
  const outgoingView = useAssetsViewStore((state) => state.outgoingView)
  const incomingView = useAssetsViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn('min-h-0', isTransitioning && assetsTransitionStack())}
      data-exchange-detail-panel
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
    >
      {isTransitioning ? (
        <AssetsTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderAssetsContent}
        />
      ) : (
        renderAssetsContent(view)
      )}
    </div>
  )
}
