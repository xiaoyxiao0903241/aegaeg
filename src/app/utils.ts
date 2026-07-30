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
