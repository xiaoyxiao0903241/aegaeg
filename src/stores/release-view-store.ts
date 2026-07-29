import { create } from 'zustand'
import { releaseHashForView, type ReleaseView } from '~/shared/config/release-deep-link'

export type { ReleaseView }
export type ReleaseViewDirection = 'forward' | 'back'

export const RELEASE_VIEW_MOTION_MS = 320

interface ReleaseViewStore {
  view: ReleaseView
  motion: boolean
  direction: ReleaseViewDirection
  outgoingView: ReleaseView | null
  incomingView: ReleaseView | null
  hasSubviewHistory: boolean
  setView: (view: ReleaseView) => void
  hydrateView: (view: ReleaseView) => void
  backToHub: (options?: { syncHash?: boolean }) => void
}

let transitionTimer: number | null = null

function clearTransitionTimer() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer)
    transitionTimer = null
  }
}

function syncReleaseHash(view: ReleaseView) {
  const next = releaseHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

export const useReleaseViewStore = create<ReleaseViewStore>((set, get) => ({
  view: 'hub',
  motion: false,
  direction: 'forward',
  outgoingView: null,
  incomingView: null,
  hasSubviewHistory: false,
  setView: (view) => {
    const { view: currentView, motion } = get()
    if (view === currentView && !motion) {
      syncReleaseHash(view)
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
    syncReleaseHash(view)

    transitionTimer = window.setTimeout(() => {
      set({
        motion: false,
        outgoingView: null,
        incomingView: null,
      })
      transitionTimer = null
    }, RELEASE_VIEW_MOTION_MS)
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
      syncReleaseHash('hub')
    }
  },
}))
