import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'
import { shellModulePanelClass } from '~/app/shell-layout'
import { useSwapViewStore, type SwapView } from '~/stores/swap-view-store'
import { SwapHubWidget } from '~/app/tabs/swap/swap-hub-widget'
import { SwapHubContent } from '~/app/tabs/swap/swap-hub-content'
import { FlashSwapWidget } from '~/app/tabs/swap/flash-swap-widget'
import { FlashSwapContent } from '~/app/tabs/swap/flash-swap-content'
import { TradeSwapWidget } from '~/app/tabs/swap/trade-swap-widget'
import { TradeSwapContent } from '~/app/tabs/swap/trade-swap-content'

const swapTransitionStackClass =
  'grid overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:min-w-0'

function renderSwapWidget(displayView: SwapView, onSelectGenesis: () => void) {
  if (displayView === 'flash') {
    return <FlashSwapWidget onSelectGenesis={onSelectGenesis} />
  }

  if (displayView === 'trade') {
    return <TradeSwapWidget onSelectGenesis={onSelectGenesis} />
  }

  return <SwapHubWidget onSelectGenesis={onSelectGenesis} />
}

function renderSwapContent(displayView: SwapView) {
  if (displayView === 'flash') {
    return <FlashSwapContent />
  }

  if (displayView === 'trade') {
    return <TradeSwapContent />
  }

  return <SwapHubContent />
}

function SwapTransitionLayers({
  direction,
  incoming,
  outgoing,
  render,
}: {
  direction: 'forward' | 'back'
  incoming: SwapView
  outgoing: SwapView
  render: (view: SwapView) => ReactNode
}) {
  return (
    <>
      <div className="swap-view-layer swap-view-layer-exit" data-swap-direction={direction}>
        <div className="swap-view-layer-motion">{render(outgoing)}</div>
      </div>
      <div className="swap-view-layer swap-view-layer-enter" data-swap-direction={direction}>
        <div className="swap-view-layer-motion">{render(incoming)}</div>
      </div>
    </>
  )
}

export function SwapWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const view = useSwapViewStore((state) => state.view)
  const motion = useSwapViewStore((state) => state.motion)
  const direction = useSwapViewStore((state) => state.direction)
  const outgoingView = useSwapViewStore((state) => state.outgoingView)
  const incomingView = useSwapViewStore((state) => state.incomingView)
  const hasSubviewHistory = useSwapViewStore((state) => state.hasSubviewHistory)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn(
        shellModulePanelClass,
        isTransitioning && swapTransitionStackClass,
        !hasSubviewHistory && view === 'hub' && !motion && 'dapp-panel-enter',
      )}
      data-swap-transitioning={isTransitioning ? 'true' : undefined}
      data-swap-widget-panel
    >
      {isTransitioning ? (
        <SwapTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={(displayView) => renderSwapWidget(displayView, onSelectGenesis)}
        />
      ) : (
        renderSwapWidget(view, onSelectGenesis)
      )}
    </div>
  )
}

export function SwapContent() {
  const view = useSwapViewStore((state) => state.view)
  const motion = useSwapViewStore((state) => state.motion)
  const direction = useSwapViewStore((state) => state.direction)
  const outgoingView = useSwapViewStore((state) => state.outgoingView)
  const incomingView = useSwapViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn('min-h-0', isTransitioning && swapTransitionStackClass)}
      data-swap-detail-panel
      data-swap-transitioning={isTransitioning ? 'true' : undefined}
    >
      {isTransitioning ? (
        <SwapTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderSwapContent}
        />
      ) : (
        renderSwapContent(view)
      )}
    </div>
  )
}
