/** 启动脚本：关闭浏览器原生滚动恢复，改由本模块持久化与恢复。 */
export const PAGE_SCROLL_RESTORATION_BOOT_SCRIPT =
  "try{if('scrollRestoration' in history){history.scrollRestoration='manual'}}catch{}"

interface SavedPageScroll {
  hash: string
  y: number
}

function readSavedPageScroll(storageKey: string): SavedPageScroll | null {
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<SavedPageScroll>
    if (typeof parsed.y !== 'number' || !Number.isFinite(parsed.y)) {
      return null
    }

    return {
      hash: typeof parsed.hash === 'string' ? parsed.hash : '',
      y: Math.max(0, parsed.y),
    }
  } catch {
    return null
  }
}

function writeSavedPageScroll(storageKey: string) {
  try {
    const payload: SavedPageScroll = {
      hash: window.location.hash,
      y: window.scrollY,
    }
    sessionStorage.setItem(storageKey, JSON.stringify(payload))
  } catch {
    // 隐私模式下 sessionStorage 可能不可用
  }
}

/** 监听 pagehide，把当前 hash 与滚动位置写入 sessionStorage。 */
export function bindPageScrollPersistence(storageKey: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.addEventListener('pagehide', () => {
    writeSavedPageScroll(storageKey)
  })
}

/**
 * 恢复持久化的页面滚动位置
 *
 * 若启用 hash 锚点且页面存在对应元素，优先滚动到锚点；否则恢复保存的滚动位置。
 *
 * @param storageKey 保存滚动位置的 sessionStorage 键
 * @param options.honorHashAnchor 是否优先滚动到 hash 锚点
 */
export function restorePersistedPageScroll(
  storageKey: string,
  options?: { honorHashAnchor?: boolean },
) {
  const honorHashAnchor = options?.honorHashAnchor ?? false
  const hash = window.location.hash

  if (honorHashAnchor && hash.length > 1) {
    const target = document.querySelector(hash)
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ block: 'start' })
      return
    }
  }

  const saved = readSavedPageScroll(storageKey)
  if (saved && saved.y > 0) {
    window.scrollTo(0, saved.y)
  }
}
