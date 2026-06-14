export const tabOrder = ['swap', 'genesis', 'rewards', 'community'] as const

export type DappTab = (typeof tabOrder)[number]

export type WalletState = 'connected' | 'disconnected'

export type DetailPanelControls = {
  collapsed: boolean
  onToggle: () => void
}
