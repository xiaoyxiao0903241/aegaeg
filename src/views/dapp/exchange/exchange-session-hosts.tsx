import type { ReactNode } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useDappShell } from '~/app/use-dapp-shell'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { viewsNeedingProvider } from '~/views/dapp/exchange/exchange-views-needing-provider'
import { useMarketTradeWidget } from '~/views/dapp/exchange/market-trade/use-market-trade-widget'
import { useFlashExchangeWidget } from '~/views/dapp/exchange/flash-exchange/use-flash-exchange-widget'
import { useBurnExchangeWidget } from '~/views/dapp/exchange/burn/use-burn-exchange-widget'
import { useTurbineExchangeWidget } from '~/views/dapp/exchange/turbine/use-turbine-exchange-widget'

export type MarketTradeState = ReturnType<typeof useMarketTradeWidget>
export type FlashExchangeState = ReturnType<typeof useFlashExchangeWidget>
export type BurnExchangeState = ReturnType<typeof useBurnExchangeWidget>
export type TurbineExchangeState = ReturnType<typeof useTurbineExchangeWidget>

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

function BurnExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  children: (burn: BurnExchangeState) => ReactNode
}) {
  const burn = useBurnExchangeWidget(sessionReady, quotesEnabled)
  return children(burn)
}

function TurbineExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  children: (turbine: TurbineExchangeState) => ReactNode
}) {
  const turbine = useTurbineExchangeWidget(sessionReady, quotesEnabled)
  return children(turbine)
}

/**
 * Lifts Trade/Flash/Burn/Turbine widget hooks once and passes state as props.
 * Mount matrix: leaving a subview unmounts its session.
 */
export function ExchangeSessionHosts({
  activeTab,
  children,
}: {
  activeTab: DappTab
  children: (sessions: {
    trade: MarketTradeState | null
    flash: FlashExchangeState | null
    burn: BurnExchangeState | null
    turbine: TurbineExchangeState | null
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
  const burnQuotesEnabled = exchangeTabActive && needed.burn
  const turbineQuotesEnabled = exchangeTabActive && needed.turbine

  const renderWithTurbine = (
    trade: MarketTradeState | null,
    flash: FlashExchangeState | null,
    burn: BurnExchangeState | null,
  ) => {
    if (!needed.turbine) {
      return children({ trade, flash, burn, turbine: null })
    }
    return (
      <TurbineExchangeSessionMounted
        quotesEnabled={turbineQuotesEnabled}
        sessionReady={sessionReady}
      >
        {(turbine) => children({ trade, flash, burn, turbine })}
      </TurbineExchangeSessionMounted>
    )
  }

  const renderWithBurn = (trade: MarketTradeState | null, flash: FlashExchangeState | null) => {
    if (!needed.burn) {
      return renderWithTurbine(trade, flash, null)
    }
    return (
      <BurnExchangeSessionMounted quotesEnabled={burnQuotesEnabled} sessionReady={sessionReady}>
        {(burn) => renderWithTurbine(trade, flash, burn)}
      </BurnExchangeSessionMounted>
    )
  }

  const renderWithFlash = (trade: MarketTradeState | null) => {
    if (!needed.flash) {
      return renderWithBurn(trade, null)
    }
    return (
      <FlashExchangeSessionMounted quotesEnabled={flashQuotesEnabled} sessionReady={sessionReady}>
        {(flash) => renderWithBurn(trade, flash)}
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
