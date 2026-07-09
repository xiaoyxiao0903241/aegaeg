import { createContext, useContext } from 'react'
import type { useGenesisWidget } from '~/hooks/use-genesis-widget'

export type GenesisWidgetContextValue = ReturnType<typeof useGenesisWidget>

export const GenesisWidgetContext = createContext<GenesisWidgetContextValue | null>(null)

export function useGenesisWidgetContext(): GenesisWidgetContextValue {
  const context = useContext(GenesisWidgetContext)
  if (!context) {
    throw new Error('useGenesisWidgetContext must be used within GenesisWidgetProvider')
  }
  return context
}
