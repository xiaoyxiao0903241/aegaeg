import { type DappTab } from '~/shared/config/dapp-tabs'
import { resolveDappLocationFromHash } from '~/shared/config/exchange-deep-link'

export function formatAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

/** Map URL hash → tab; legacy `#swap` and `#exchange/<view>` supported. */
export function resolveTabFromHash(hash: string): DappTab | null {
  return resolveDappLocationFromHash(hash)?.tab ?? null
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
