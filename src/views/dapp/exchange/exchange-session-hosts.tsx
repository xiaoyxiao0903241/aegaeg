import type { ReactNode } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useDappShell } from '~/app/use-dapp-shell'
import { useExchangeViewMotion } from '~/stores/exchange-view-store'
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
  readsEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  readsEnabled: boolean
  children: (trade: MarketTradeState) => ReactNode
}) {
  const trade = useMarketTradeWidget(sessionReady, quotesEnabled, readsEnabled)
  return children(trade)
}

function FlashExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  readsEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  readsEnabled: boolean
  children: (flash: FlashExchangeState) => ReactNode
}) {
  const flash = useFlashExchangeWidget(sessionReady, quotesEnabled, readsEnabled)
  return children(flash)
}

function BurnExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  readsEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  readsEnabled: boolean
  children: (burn: BurnExchangeState) => ReactNode
}) {
  const burn = useBurnExchangeWidget(sessionReady, quotesEnabled, readsEnabled)
  return children(burn)
}

function TurbineExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  readsEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  readsEnabled: boolean
  children: (turbine: TurbineExchangeState) => ReactNode
}) {
  const turbine = useTurbineExchangeWidget(sessionReady, quotesEnabled, readsEnabled)
  return children(turbine)
}

/**
 * Lifts Trade/Flash/Burn/Turbine widget hooks once and passes state as props.
 * While the Exchange tab is active, all four sessions stay mounted (reads warm);
 * amount quotes only run for the visible (+ motion) subview.
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
  const { view, motion, outgoingView, incomingView } = useExchangeViewMotion()
  const exchangeTabActive = activeTab === 'exchange'
  const needed = viewsNeedingProvider(view, motion, outgoingView, incomingView)
  /** Mount all sessions on the Exchange tab so hub → program / Segment switches hit cache. */
  const mount = exchangeTabActive ? { flash: true, trade: true, burn: true, turbine: true } : needed
  const readsEnabled = exchangeTabActive
  const flashQuotesEnabled = exchangeTabActive && needed.flash
  const tradeQuotesEnabled = exchangeTabActive && needed.trade
  const burnQuotesEnabled = exchangeTabActive && needed.burn
  const turbineQuotesEnabled = exchangeTabActive && needed.turbine

  const renderWithTurbine = (
    trade: MarketTradeState | null,
    flash: FlashExchangeState | null,
    burn: BurnExchangeState | null,
  ) => {
    if (!mount.turbine) {
      return children({ trade, flash, burn, turbine: null })
    }
    return (
      <TurbineExchangeSessionMounted
        quotesEnabled={turbineQuotesEnabled}
        readsEnabled={readsEnabled}
        sessionReady={sessionReady}
      >
        {(turbine) => children({ trade, flash, burn, turbine })}
      </TurbineExchangeSessionMounted>
    )
  }

  const renderWithBurn = (trade: MarketTradeState | null, flash: FlashExchangeState | null) => {
    if (!mount.burn) {
      return renderWithTurbine(trade, flash, null)
    }
    return (
      <BurnExchangeSessionMounted
        quotesEnabled={burnQuotesEnabled}
        readsEnabled={readsEnabled}
        sessionReady={sessionReady}
      >
        {(burn) => renderWithTurbine(trade, flash, burn)}
      </BurnExchangeSessionMounted>
    )
  }

  const renderWithFlash = (trade: MarketTradeState | null) => {
    if (!mount.flash) {
      return renderWithBurn(trade, null)
    }
    return (
      <FlashExchangeSessionMounted
        quotesEnabled={flashQuotesEnabled}
        readsEnabled={readsEnabled}
        sessionReady={sessionReady}
      >
        {(flash) => renderWithBurn(trade, flash)}
      </FlashExchangeSessionMounted>
    )
  }

  if (!mount.trade) {
    return renderWithFlash(null)
  }

  return (
    <MarketTradeSessionMounted
      quotesEnabled={tradeQuotesEnabled}
      readsEnabled={readsEnabled}
      sessionReady={sessionReady}
    >
      {(trade) => renderWithFlash(trade)}
    </MarketTradeSessionMounted>
  )
}
