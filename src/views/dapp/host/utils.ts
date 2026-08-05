/**
 * 将 DApp 左右两个面板与整个窗口滚动到顶部。
 *
 * 切换 Tab 或点击引导类 CTA 后调用；
 * 用 requestAnimationFrame 延后到下一帧执行，确保新的面板已挂载。
 */
export function scrollDappPanelsToTop() {
  requestAnimationFrame(() => {
    const hostWindow = document.querySelector('[data-dapp-window]')
    const widget = document.querySelector('[data-dapp-widget-panel]')
    const detail = document.querySelector('[data-dapp-detail]')
    if (hostWindow instanceof HTMLElement) {
      hostWindow.scrollTop = 0
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
