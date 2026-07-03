import { MOBILE_MAX_WIDTH_QUERY } from '~/lib/breakpoints'

const VIEWPORT_DATASET_KEY = 'viewport'

/** 供 `legacy-browser-fallback.css` 的 `[data-viewport]` 选择器；matchMedia 在旧 WebView 仍可用。 */
export function syncViewportDataset(): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const apply = () => {
    const h5 = window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches
    root.dataset[VIEWPORT_DATASET_KEY] = h5 ? 'h5' : 'pc'
  }

  apply()

  const media = window.matchMedia(MOBILE_MAX_WIDTH_QUERY)
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', apply)
    return
  }

  media.addListener(apply)
}
