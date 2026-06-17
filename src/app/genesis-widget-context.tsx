import { createContext, useContext, type ReactNode } from 'react'
import { useGenesisWidget } from '~/hooks/use-genesis-widget'

type GenesisWidgetContextValue = ReturnType<typeof useGenesisWidget>

const GenesisWidgetContext = createContext<GenesisWidgetContextValue | null>(null)

export function GenesisWidgetProvider({ children }: { children: ReactNode }) {
  const value = useGenesisWidget()
  return <GenesisWidgetContext.Provider value={value}>{children}</GenesisWidgetContext.Provider>
}

export function useGenesisWidgetContext(): GenesisWidgetContextValue {
  const context = useContext(GenesisWidgetContext)
  if (!context) {
    throw new Error('useGenesisWidgetContext must be used within GenesisWidgetProvider')
  }
  return context
}
