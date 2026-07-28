import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import { useExchangeViewStore, type ExchangeView } from '~/stores/exchange-view-store'
import type {
  BurnExchangeState,
  FlashExchangeState,
  MarketTradeState,
  TurbineExchangeState,
} from '~/views/dapp/exchange/exchange-session-hosts'
import { ExchangeHubWidget } from '~/views/dapp/exchange/hub/exchange-hub-widget'
import { ExchangeHubContent } from '~/views/dapp/exchange/hub/exchange-hub-content'
import { FlashExchangeWidget } from '~/views/dapp/exchange/flash-exchange/flash-exchange-widget'
import { FlashExchangeContent } from '~/views/dapp/exchange/flash-exchange/flash-exchange-content'
import { MarketTradeWidget } from '~/views/dapp/exchange/market-trade/market-trade-widget'
import { MarketTradeContent } from '~/views/dapp/exchange/market-trade/market-trade-content'
import { BurnExchangeWidget } from '~/views/dapp/exchange/burn/burn-exchange-widget'
import { BurnExchangeContent } from '~/views/dapp/exchange/burn/burn-exchange-content'
import { TurbineExchangeWidget } from '~/views/dapp/exchange/turbine/turbine-exchange-widget'
import { TurbineExchangeContent } from '~/views/dapp/exchange/turbine/turbine-exchange-content'

const exchangeTransitionStack = tv({
  base: 'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0',
})

function requireTrade(trade: MarketTradeState | null): MarketTradeState {
  if (!trade) {
    throw new Error('MarketTrade view requires a lifted trade session')
  }
  return trade
}

function requireFlash(flash: FlashExchangeState | null): FlashExchangeState {
  if (!flash) {
    throw new Error('FlashExchange view requires a lifted flash session')
  }
  return flash
}

function requireBurn(burn: BurnExchangeState | null): BurnExchangeState {
  if (!burn) {
    throw new Error('BurnExchange view requires a lifted burn session')
  }
  return burn
}

function requireTurbine(turbine: TurbineExchangeState | null): TurbineExchangeState {
  if (!turbine) {
    throw new Error('TurbineExchange view requires a lifted turbine session')
  }
  return turbine
}

function renderExchangeWidget(
  displayView: ExchangeView,
  trade: MarketTradeState | null,
  flash: FlashExchangeState | null,
  burn: BurnExchangeState | null,
  turbine: TurbineExchangeState | null,
) {
  if (displayView === 'flash') {
    return <FlashExchangeWidget flash={requireFlash(flash)} />
  }

  if (displayView === 'trade') {
    return <MarketTradeWidget trade={requireTrade(trade)} />
  }

  if (displayView === 'burn') {
    return <BurnExchangeWidget burn={requireBurn(burn)} />
  }

  if (displayView === 'turbine') {
    return <TurbineExchangeWidget turbine={requireTurbine(turbine)} />
  }

  return <ExchangeHubWidget />
}

function renderExchangeContent(
  displayView: ExchangeView,
  trade: MarketTradeState | null,
  flash: FlashExchangeState | null,
  burn: BurnExchangeState | null,
  turbine: TurbineExchangeState | null,
) {
  if (displayView === 'flash') {
    return <FlashExchangeContent flash={requireFlash(flash)} />
  }

  if (displayView === 'trade') {
    return <MarketTradeContent trade={requireTrade(trade)} />
  }

  if (displayView === 'burn') {
    return <BurnExchangeContent burn={requireBurn(burn)} />
  }

  if (displayView === 'turbine') {
    return <TurbineExchangeContent turbine={requireTurbine(turbine)} />
  }

  return <ExchangeHubContent />
}

function ExchangeTransitionLayers({
  direction,
  incoming,
  outgoing,
  render,
}: {
  direction: 'forward' | 'back'
  incoming: ExchangeView
  outgoing: ExchangeView
  render: (view: ExchangeView) => ReactNode
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

export function ExchangeWidget({
  trade,
  flash,
  burn,
  turbine,
}: {
  trade: MarketTradeState | null
  flash: FlashExchangeState | null
  burn: BurnExchangeState | null
  turbine: TurbineExchangeState | null
}) {
  const view = useExchangeViewStore((state) => state.view)
  const motion = useExchangeViewStore((state) => state.motion)
  const direction = useExchangeViewStore((state) => state.direction)
  const outgoingView = useExchangeViewStore((state) => state.outgoingView)
  const incomingView = useExchangeViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn(
        'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0',
        isTransitioning && exchangeTransitionStack(),
      )}
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
      data-exchange-widget-panel
    >
      {isTransitioning ? (
        <ExchangeTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={(displayView) => renderExchangeWidget(displayView, trade, flash, burn, turbine)}
        />
      ) : (
        renderExchangeWidget(view, trade, flash, burn, turbine)
      )}
    </div>
  )
}

export function ExchangeContent({
  trade,
  flash,
  burn,
  turbine,
}: {
  trade: MarketTradeState | null
  flash: FlashExchangeState | null
  burn: BurnExchangeState | null
  turbine: TurbineExchangeState | null
}) {
  const view = useExchangeViewStore((state) => state.view)
  const motion = useExchangeViewStore((state) => state.motion)
  const direction = useExchangeViewStore((state) => state.direction)
  const outgoingView = useExchangeViewStore((state) => state.outgoingView)
  const incomingView = useExchangeViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn('min-h-0', isTransitioning && exchangeTransitionStack())}
      data-exchange-detail-panel
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
    >
      {isTransitioning ? (
        <ExchangeTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={(displayView) => renderExchangeContent(displayView, trade, flash, burn, turbine)}
        />
      ) : (
        renderExchangeContent(view, trade, flash, burn, turbine)
      )}
    </div>
  )
}
