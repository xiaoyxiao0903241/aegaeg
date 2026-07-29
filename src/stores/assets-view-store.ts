import { create } from 'zustand'
import { assetsHashForView, type AssetsView } from '~/shared/config/assets-deep-link'

export type { AssetsView }
export type AssetsViewDirection = 'forward' | 'back'

export const ASSETS_VIEW_MOTION_MS = 320

interface AssetsViewStore {
  view: AssetsView
  motion: boolean
  direction: AssetsViewDirection
  outgoingView: AssetsView | null
  incomingView: AssetsView | null
  hasSubviewHistory: boolean
  setView: (view: AssetsView) => void
  /** Hash hydrate — no motion, no hash write (caller owns URL). */
  hydrateView: (view: AssetsView) => void
  backToHub: (options?: { syncHash?: boolean }) => void
}

let transitionTimer: number | null = null

function clearTransitionTimer() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer)
    transitionTimer = null
  }
}

function syncAssetsHash(view: AssetsView) {
  const next = assetsHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useAssetsViewStore = create<AssetsViewStore>((set, get) => ({
  view: 'hub',
  motion: false,
  direction: 'forward',
  outgoingView: null,
  incomingView: null,
  hasSubviewHistory: false,
  setView: (view) => {
    const { view: currentView, motion } = get()
    if (view === currentView && !motion) {
      syncAssetsHash(view)
      return
    }
    if (motion) return

    const outgoingView = currentView
    const back = view === 'hub' && outgoingView !== 'hub'
    const leavingHub = outgoingView === 'hub' && view !== 'hub'

    clearTransitionTimer()
    set({
      view,
      motion: true,
      direction: back ? 'back' : 'forward',
      outgoingView,
      incomingView: view,
      ...(leavingHub ? { hasSubviewHistory: true } : null),
    })
    syncAssetsHash(view)

    transitionTimer = window.setTimeout(() => {
      set({
        motion: false,
        outgoingView: null,
        incomingView: null,
      })
      transitionTimer = null
    }, ASSETS_VIEW_MOTION_MS)
  },
  hydrateView: (view) => {
    clearTransitionTimer()
    set({
      view,
      motion: false,
      direction: 'forward',
      outgoingView: null,
      incomingView: null,
      hasSubviewHistory: view !== 'hub',
    })
  },
  backToHub: (options) => {
    clearTransitionTimer()
    set({
      view: 'hub',
      motion: false,
      direction: 'forward',
      outgoingView: null,
      incomingView: null,
      hasSubviewHistory: false,
    })
    if (options?.syncHash !== false) {
      syncAssetsHash('hub')
    }
  },
}))
