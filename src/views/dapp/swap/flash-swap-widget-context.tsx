import { createContext, useContext, type ReactNode } from 'react'
import { useFlashSwapWidget } from '~/views/dapp/swap/use-flash-swap-widget'

type FlashSwapWidgetContextValue = ReturnType<typeof useFlashSwapWidget>

const FlashSwapWidgetContext = createContext<FlashSwapWidgetContextValue | null>(null)

export function FlashSwapWidgetProvider({
  children,
  sessionReady,
  quotesEnabled,
}: {
  children: ReactNode
  sessionReady: boolean
  quotesEnabled: boolean
}) {
  const value = useFlashSwapWidget(sessionReady, quotesEnabled)
  return (
    <FlashSwapWidgetContext.Provider value={value}>{children}</FlashSwapWidgetContext.Provider>
  )
}

export function useFlashSwapWidgetContext(): FlashSwapWidgetContextValue {
  const context = useContext(FlashSwapWidgetContext)
  if (!context) {
    throw new Error('useFlashSwapWidgetContext must be used within FlashSwapWidgetProvider')
  }
  return context
}
