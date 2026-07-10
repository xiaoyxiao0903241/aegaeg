import { createContext, useContext, type ReactNode } from 'react'
import { useSwapWidget } from '~/views/dapp/swap/trade-swap/use-swap-widget'

type TradeSwapWidgetContextValue = ReturnType<typeof useSwapWidget>

const TradeSwapWidgetContext = createContext<TradeSwapWidgetContextValue | null>(null)

export function TradeSwapWidgetProvider({
  children,
  sessionReady,
  quotesEnabled,
}: {
  children: ReactNode
  sessionReady: boolean
  quotesEnabled: boolean
}) {
  const value = useSwapWidget(sessionReady, quotesEnabled)
  return (
    <TradeSwapWidgetContext.Provider value={value}>{children}</TradeSwapWidgetContext.Provider>
  )
}

export function useTradeSwapWidgetContext(): TradeSwapWidgetContextValue {
  const context = useContext(TradeSwapWidgetContext)
  if (!context) {
    throw new Error('useTradeSwapWidgetContext must be used within TradeSwapWidgetProvider')
  }
  return context
}
