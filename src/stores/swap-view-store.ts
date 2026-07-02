import { create } from 'zustand'
import { scrollDappPanelsToTop } from '~/app/utils'

export type SwapView = 'hub' | 'flash' | 'trade'
export type SwapViewDirection = 'forward' | 'back'

export const SWAP_VIEW_MOTION_MS = 320

interface SwapViewStore {
  view: SwapView
  motion: boolean
  direction: SwapViewDirection
  outgoingView: SwapView | null
  incomingView: SwapView | null
  hasSubviewHistory: boolean
  setView: (view: SwapView) => void
  backToHub: () => void
}

let transitionTimer: number | null = null

function clearTransitionTimer() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer)
    transitionTimer = null
  }
}

export const useSwapViewStore = create<SwapViewStore>((set, get) => ({
  view: 'hub',
  motion: false,
  direction: 'forward',
  outgoingView: null,
  incomingView: null,
  hasSubviewHistory: false,
  setView: (view) => {
    const { view: currentView, motion } = get()
    if (view === currentView && !motion) return
    if (motion) return

    scrollDappPanelsToTop()

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

    transitionTimer = window.setTimeout(() => {
      set({
        motion: false,
        outgoingView: null,
        incomingView: null,
      })
      transitionTimer = null
    }, SWAP_VIEW_MOTION_MS)
  },
  backToHub: () => {
    clearTransitionTimer()
    set({
      view: 'hub',
      motion: false,
      direction: 'forward',
      outgoingView: null,
      incomingView: null,
      hasSubviewHistory: false,
    })
  },
}))
