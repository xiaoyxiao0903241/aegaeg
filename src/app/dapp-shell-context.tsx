import { createContext, useContext, type ReactNode } from 'react'
import type { DappTab } from './types'

export interface DappShellState {
  tab: DappTab
  connected: boolean
  detailCollapsed: boolean
}

const DappShellContext = createContext<DappShellState | null>(null)

export function DappShellProvider({
  children,
  value,
}: {
  children: ReactNode
  value: DappShellState
}) {
  return (
    <DappShellContext.Provider value={value}>{children}</DappShellContext.Provider>
  )
}

export function useDappShell() {
  const context = useContext(DappShellContext)
  if (!context) {
    throw new Error('useDappShell must be used within DappShellProvider')
  }
  return context
}
