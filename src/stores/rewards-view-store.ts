import { create } from 'zustand'
import { rewardsHashForView, type RewardsView } from '~/shared/config/rewards-deep-link'
import { DAPP_VIEW_MOTION_MS } from '~/stores/dapp-view-motion'

export type { RewardsView }
export type RewardsViewDirection = 'forward' | 'back'

interface RewardsViewStore {
  view: RewardsView
  motion: boolean
  direction: RewardsViewDirection
  outgoingView: RewardsView | null
  incomingView: RewardsView | null
  hasSubviewHistory: boolean
  setView: (view: RewardsView) => void
  hydrateView: (view: RewardsView) => void
  backToHub: (options?: { syncHash?: boolean }) => void
}

let transitionTimer: number | null = null

function clearTransitionTimer() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer)
    transitionTimer = null
  }
}

function syncRewardsHash(view: RewardsView) {
  const next = rewardsHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

export const useRewardsViewStore = create<RewardsViewStore>((set, get) => ({
  view: 'hub',
  motion: false,
  direction: 'forward',
  outgoingView: null,
  incomingView: null,
  hasSubviewHistory: false,
  setView: (view) => {
    const { view: currentView, motion } = get()
    if (view === currentView && !motion) {
      syncRewardsHash(view)
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
    syncRewardsHash(view)

    transitionTimer = window.setTimeout(() => {
      set({
        motion: false,
        outgoingView: null,
        incomingView: null,
      })
      transitionTimer = null
    }, DAPP_VIEW_MOTION_MS)
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
      syncRewardsHash('hub')
    }
  },
}))
