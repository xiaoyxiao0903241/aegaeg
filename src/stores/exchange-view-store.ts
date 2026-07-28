import { create } from 'zustand'
import { exchangeHashForView, type ExchangeView } from '~/shared/config/exchange-deep-link'

export type { ExchangeView }
export type ExchangeViewDirection = 'forward' | 'back'

export const EXCHANGE_VIEW_MOTION_MS = 320

interface ExchangeViewStore {
  view: ExchangeView
  motion: boolean
  direction: ExchangeViewDirection
  outgoingView: ExchangeView | null
  incomingView: ExchangeView | null
  hasSubviewHistory: boolean
  setView: (view: ExchangeView) => void
  /** Hash hydrate — no motion, no hash write (caller owns URL). */
  hydrateView: (view: ExchangeView) => void
  backToHub: (options?: { syncHash?: boolean }) => void
}

let transitionTimer: number | null = null

function clearTransitionTimer() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer)
    transitionTimer = null
  }
}

function syncExchangeHash(view: ExchangeView) {
  const next = exchangeHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useExchangeViewStore = create<ExchangeViewStore>((set, get) => ({
  view: 'hub',
  motion: false,
  direction: 'forward',
  outgoingView: null,
  incomingView: null,
  hasSubviewHistory: false,
  setView: (view) => {
    const { view: currentView, motion } = get()
    if (view === currentView && !motion) {
      syncExchangeHash(view)
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
    syncExchangeHash(view)

    transitionTimer = window.setTimeout(() => {
      set({
        motion: false,
        outgoingView: null,
        incomingView: null,
      })
      transitionTimer = null
    }, EXCHANGE_VIEW_MOTION_MS)
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
      syncExchangeHash('hub')
    }
  },
}))
