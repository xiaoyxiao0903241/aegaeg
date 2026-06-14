import { tabOrder, type DappTab } from './types'

export function formatAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function isDappTab(value: string): value is DappTab {
  return tabOrder.includes(value as DappTab)
}

export function getInitialTab(): DappTab {
  const hash = window.location.hash.slice(1)
  return isDappTab(hash) ? hash : 'swap'
}

