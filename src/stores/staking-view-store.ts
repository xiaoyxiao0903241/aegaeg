import { create } from 'zustand'
import { stakingHashForView, type StakingView } from '~/shared/config/staking-deep-link'
import type { BondPeriod, StakePeriod } from '~/core/staking/staking-period'
import { DAPP_VIEW_MOTION_MS } from '~/stores/dapp-view-motion'

export type { StakingView }
export type StakingViewDirection = 'forward' | 'back'

interface StakingViewStore {
  view: StakingView
  motion: boolean
  direction: StakingViewDirection
  outgoingView: StakingView | null
  incomingView: StakingView | null
  hasSubviewHistory: boolean
  /** Shared with stake widget + aside — SSOT for remainingQuota period. */
  stakePeriod: StakePeriod
  /** Shared with bond widget + aside — SSOT for discount/cap per kind. */
  lpBondPeriod: BondPeriod
  burnBondPeriod: BondPeriod
  setView: (view: StakingView) => void
  /** Hash hydrate — no motion, no hash write (caller owns URL). */
  hydrateView: (view: StakingView) => void
  backToHub: (options?: { syncHash?: boolean }) => void
  setStakePeriod: (period: StakePeriod) => void
  setBondPeriod: (kind: 'lp' | 'burn', period: BondPeriod) => void
}

let transitionTimer: number | null = null

function clearTransitionTimer() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer)
    transitionTimer = null
  }
}

function syncStakingHash(view: StakingView) {
  const next = stakingHashForView(view).slice(1)
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useStakingViewStore = create<StakingViewStore>((set, get) => ({
  view: 'hub',
  motion: false,
  direction: 'forward',
  outgoingView: null,
  incomingView: null,
  hasSubviewHistory: false,
  stakePeriod: 'liquid',
  lpBondPeriod: '180',
  burnBondPeriod: '180',
  setStakePeriod: (period) => set({ stakePeriod: period }),
  setBondPeriod: (kind, period) =>
    set(kind === 'lp' ? { lpBondPeriod: period } : { burnBondPeriod: period }),
  setView: (view) => {
    const { view: currentView, motion } = get()
    if (view === currentView && !motion) {
      syncStakingHash(view)
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
    syncStakingHash(view)

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
      syncStakingHash('hub')
    }
  },
}))
