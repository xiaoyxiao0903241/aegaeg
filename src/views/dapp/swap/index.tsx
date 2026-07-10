import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import { useSwapViewStore, type SwapView } from '~/stores/swap-view-store'
import type { FlashSwapState, TradeSwapState } from '~/views/dapp/swap/swap-session-hosts'
import { SwapHubWidget } from '~/views/dapp/swap/hub/swap-hub-widget'
import { SwapHubContent } from '~/views/dapp/swap/hub/swap-hub-content'
import { FlashSwapWidget } from '~/views/dapp/swap/flash-swap/flash-swap-widget'
import { FlashSwapContent } from '~/views/dapp/swap/flash-swap/flash-swap-content'
import { TradeSwapWidget } from '~/views/dapp/swap/trade-swap/trade-swap-widget'
import { TradeSwapContent } from '~/views/dapp/swap/trade-swap/trade-swap-content'

const swapTransitionStack = tv({
  base: 'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0',
})

function requireTrade(trade: TradeSwapState | null): TradeSwapState {
  if (!trade) {
    throw new Error('TradeSwap view requires a lifted trade session')
  }
  return trade
}

function requireFlash(flash: FlashSwapState | null): FlashSwapState {
  if (!flash) {
    throw new Error('FlashSwap view requires a lifted flash session')
  }
  return flash
}

function renderSwapWidget(
  displayView: SwapView,
  onSelectGenesis: () => void,
  trade: TradeSwapState | null,
  flash: FlashSwapState | null,
) {
  if (displayView === 'flash') {
    return <FlashSwapWidget onSelectGenesis={onSelectGenesis} swap={requireFlash(flash)} />
  }

  if (displayView === 'trade') {
    return <TradeSwapWidget onSelectGenesis={onSelectGenesis} swap={requireTrade(trade)} />
  }

  return <SwapHubWidget onSelectGenesis={onSelectGenesis} />
}

function renderSwapContent(
  displayView: SwapView,
  trade: TradeSwapState | null,
  flash: FlashSwapState | null,
) {
  if (displayView === 'flash') {
    return <FlashSwapContent flash={requireFlash(flash)} />
  }

  if (displayView === 'trade') {
    return <TradeSwapContent trade={requireTrade(trade)} />
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
  trade,
  flash,
}: {
  onSelectGenesis: () => void
  trade: TradeSwapState | null
  flash: FlashSwapState | null
}) {
  const view = useSwapViewStore((state) => state.view)
  const motion = useSwapViewStore((state) => state.motion)
  const direction = useSwapViewStore((state) => state.direction)
  const outgoingView = useSwapViewStore((state) => state.outgoingView)
  const incomingView = useSwapViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn(
        'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0',
        isTransitioning && swapTransitionStack(),
      )}
      data-swap-transitioning={isTransitioning ? 'true' : undefined}
      data-swap-widget-panel
    >
      {isTransitioning ? (
        <SwapTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={(displayView) =>
            renderSwapWidget(displayView, onSelectGenesis, trade, flash)
          }
        />
      ) : (
        renderSwapWidget(view, onSelectGenesis, trade, flash)
      )}
    </div>
  )
}

export function SwapContent({
  trade,
  flash,
}: {
  trade: TradeSwapState | null
  flash: FlashSwapState | null
}) {
  const view = useSwapViewStore((state) => state.view)
  const motion = useSwapViewStore((state) => state.motion)
  const direction = useSwapViewStore((state) => state.direction)
  const outgoingView = useSwapViewStore((state) => state.outgoingView)
  const incomingView = useSwapViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn('min-h-0', isTransitioning && swapTransitionStack())}
      data-swap-detail-panel
      data-swap-transitioning={isTransitioning ? 'true' : undefined}
    >
      {isTransitioning ? (
        <SwapTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={(displayView) => renderSwapContent(displayView, trade, flash)}
        />
      ) : (
        renderSwapContent(view, trade, flash)
      )}
    </div>
  )
}
