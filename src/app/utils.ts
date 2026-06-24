import { tabOrder, type DappTab } from '~/app/types'

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

/** Scroll both DApp panels and the H5 page to top — used after tab switch or promo CTA navigation. */
export function scrollDappPanelsToTop() {
  requestAnimationFrame(() => {
    const widget = document.querySelector('[data-dapp-widget-panel]')
    const detail = document.querySelector('[data-dapp-detail]')
    if (widget instanceof HTMLElement) {
      widget.scrollTop = 0
    }
    if (detail instanceof HTMLElement) {
      detail.scrollTop = 0
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  })
}

/** @deprecated Use scrollDappPanelsToTop() for all panel/page top resets. */
export function scrollToGenesisPageTop() {
  scrollDappPanelsToTop()
}
