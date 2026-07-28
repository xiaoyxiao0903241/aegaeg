import { tabOrder, type DappTab } from '~/shared/config/dapp-tabs'

export function formatAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function isDappTab(value: string): value is DappTab {
  return tabOrder.includes(value as DappTab)
}

/** Map URL hash → tab; legacy `#swap` bookmarks resolve to exchange. */
export function resolveTabFromHash(hash: string): DappTab | null {
  if (hash === 'swap') return 'exchange'
  return isDappTab(hash) ? hash : null
}

export function getInitialTab(): DappTab {
  return resolveTabFromHash(window.location.hash.slice(1)) ?? 'exchange'
}

/** Scroll both DApp panels and the H5 window to top — used after tab switch or promo CTA navigation. */
export function scrollDappPanelsToTop() {
  requestAnimationFrame(() => {
    const shellWindow = document.querySelector('[data-dapp-window]')
    const widget = document.querySelector('[data-dapp-widget-panel]')
    const detail = document.querySelector('[data-dapp-detail]')
    if (shellWindow instanceof HTMLElement) {
      shellWindow.scrollTop = 0
    }
    if (widget instanceof HTMLElement) {
      widget.scrollTop = 0
    }
    if (detail instanceof HTMLElement) {
      detail.scrollTop = 0
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  })
}
