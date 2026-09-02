function resetScrollTop(node: { scrollTop?: number } | null) {
  if (node) node.scrollTop = 0
}

/**
 * 将 DApp 左右两个面板与窗口滚动口滚到顶部。
 *
 * 切 Tab 或切 hub/子页后调用。
 * 用 requestAnimationFrame 延后到下一帧，等新面板挂上。
 * 会清 H5 窗口滚动口、左右栏滚动口，以及 `window` 本身。
 */
export function scrollDappPanelsToTop() {
  requestAnimationFrame(() => {
    resetScrollTop(document.querySelector('[data-dapp-window]'))
    resetScrollTop(document.querySelector('[data-dapp-window-scroll]'))
    resetScrollTop(document.querySelector('[data-dapp-detail]'))
    document.querySelectorAll('[data-dapp-widget-scroll]').forEach((node) => {
      resetScrollTop(node)
    })
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  })
}
