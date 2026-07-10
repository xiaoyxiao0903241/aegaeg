import type { ReactNode } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useDappShell } from '~/app/use-dapp-shell'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { viewsNeedingProvider } from '~/views/dapp/swap/swap-views-needing-provider'
import { useSwapWidget } from '~/views/dapp/swap/trade-swap/use-swap-widget'
import { useFlashSwapWidget } from '~/views/dapp/swap/flash-swap/use-flash-swap-widget'

export type TradeSwapState = ReturnType<typeof useSwapWidget>
export type FlashSwapState = ReturnType<typeof useFlashSwapWidget>

function TradeSwapSessionMounted({
  sessionReady,
  quotesEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  children: (trade: TradeSwapState) => ReactNode
}) {
  const trade = useSwapWidget(sessionReady, quotesEnabled)
  return children(trade)
}

function FlashSwapSessionMounted({
  sessionReady,
  quotesEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  children: (flash: FlashSwapState) => ReactNode
}) {
  const flash = useFlashSwapWidget(sessionReady, quotesEnabled)
  return children(flash)
}

/**
 * Lifts Trade/Flash widget hooks once and passes state as props.
 * Mount matrix matches former providers: leaving a subview unmounts its session.
 */
export function SwapSessionHosts({
  activeTab,
  children,
}: {
  activeTab: DappTab
  children: (sessions: {
    trade: TradeSwapState | null
    flash: FlashSwapState | null
  }) => ReactNode
}) {
  const { sessionReady } = useDappShell()
  const view = useSwapViewStore((state) => state.view)
  const motion = useSwapViewStore((state) => state.motion)
  const outgoingView = useSwapViewStore((state) => state.outgoingView)
  const incomingView = useSwapViewStore((state) => state.incomingView)
  const swapTabActive = activeTab === 'swap'
  const needed = viewsNeedingProvider(view, motion, outgoingView, incomingView)
  const flashQuotesEnabled = swapTabActive && needed.flash
  const tradeQuotesEnabled = swapTabActive && needed.trade

  const renderWithFlash = (trade: TradeSwapState | null) => {
    if (!needed.flash) {
      return children({ trade, flash: null })
    }
    return (
      <FlashSwapSessionMounted
        quotesEnabled={flashQuotesEnabled}
        sessionReady={sessionReady}
      >
        {(flash) => children({ trade, flash })}
      </FlashSwapSessionMounted>
    )
  }

  if (!needed.trade) {
    return renderWithFlash(null)
  }

  return (
    <TradeSwapSessionMounted quotesEnabled={tradeQuotesEnabled} sessionReady={sessionReady}>
      {(trade) => renderWithFlash(trade)}
    </TradeSwapSessionMounted>
  )
}
