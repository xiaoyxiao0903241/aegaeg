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
    // sessionStorage may be unavailable in private mode
  }
}

export function bindPageScrollPersistence(storageKey: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.addEventListener('pagehide', () => {
    writeSavedPageScroll(storageKey)
  })
}

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
