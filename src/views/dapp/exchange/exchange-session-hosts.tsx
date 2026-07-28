import type { ReactNode } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useDappShell } from '~/app/use-dapp-shell'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { viewsNeedingProvider } from '~/views/dapp/exchange/exchange-views-needing-provider'
import { useMarketTradeWidget } from '~/views/dapp/exchange/market-trade/use-market-trade-widget'
import { useFlashExchangeWidget } from '~/views/dapp/exchange/flash-exchange/use-flash-exchange-widget'

export type MarketTradeState = ReturnType<typeof useMarketTradeWidget>
export type FlashExchangeState = ReturnType<typeof useFlashExchangeWidget>

function MarketTradeSessionMounted({
  sessionReady,
  quotesEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  children: (trade: MarketTradeState) => ReactNode
}) {
  const trade = useMarketTradeWidget(sessionReady, quotesEnabled)
  return children(trade)
}

function FlashExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  children: (flash: FlashExchangeState) => ReactNode
}) {
  const flash = useFlashExchangeWidget(sessionReady, quotesEnabled)
  return children(flash)
}

/**
 * Lifts Trade/Flash widget hooks once and passes state as props.
 * Mount matrix matches former providers: leaving a subview unmounts its session.
 */
export function ExchangeSessionHosts({
  activeTab,
  children,
}: {
  activeTab: DappTab
  children: (sessions: {
    trade: MarketTradeState | null
    flash: FlashExchangeState | null
  }) => ReactNode
}) {
  const { sessionReady } = useDappShell()
  const view = useExchangeViewStore((state) => state.view)
  const motion = useExchangeViewStore((state) => state.motion)
  const outgoingView = useExchangeViewStore((state) => state.outgoingView)
  const incomingView = useExchangeViewStore((state) => state.incomingView)
  const exchangeTabActive = activeTab === 'exchange'
  const needed = viewsNeedingProvider(view, motion, outgoingView, incomingView)
  const flashQuotesEnabled = exchangeTabActive && needed.flash
  const tradeQuotesEnabled = exchangeTabActive && needed.trade

  const renderWithFlash = (trade: MarketTradeState | null) => {
    if (!needed.flash) {
      return children({ trade, flash: null })
    }
    return (
      <FlashExchangeSessionMounted quotesEnabled={flashQuotesEnabled} sessionReady={sessionReady}>
        {(flash) => children({ trade, flash })}
      </FlashExchangeSessionMounted>
    )
  }

  if (!needed.trade) {
    return renderWithFlash(null)
  }

  return (
    <MarketTradeSessionMounted quotesEnabled={tradeQuotesEnabled} sessionReady={sessionReady}>
      {(trade) => renderWithFlash(trade)}
    </MarketTradeSessionMounted>
  )
}
