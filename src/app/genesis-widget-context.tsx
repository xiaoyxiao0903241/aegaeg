import { type ReactNode } from 'react'
import { useGenesisWidget } from '~/hooks/use-genesis-widget'
import { GenesisWidgetContext } from '~/app/use-genesis-widget-context'

export function GenesisWidgetProvider({ children }: { children: ReactNode }) {
  const value = useGenesisWidget()
  return <GenesisWidgetContext.Provider value={value}>{children}</GenesisWidgetContext.Provider>
}
