import { create, type StoreApi, type UseBoundStore } from 'zustand'

/** Shared subview enter/exit duration for DApp tab view stores. */
const DAPP_VIEW_MOTION_MS = 320

export type DappViewDirection = 'forward' | 'back'

/** Shared subview navigation fields for DApp tab view stores. */
export type DappSubviewState<TView extends string> = {
  view: TView
  motion: boolean
  direction: DappViewDirection
  outgoingView: TView | null
  incomingView: TView | null
  hasSubviewHistory: boolean
  setView: (view: TView) => void
  /** Hash hydrate — no motion, no hash write (caller owns URL). */
  hydrateView: (view: TView) => void
  backToHub: (options?: { syncHash?: boolean }) => void
}

type CreateDappSubviewStoreOptions<TView extends string, TExtra extends object> = {
  hub: TView
  /** Hash string for a view (e.g. `#/assets/claim`); factory owns write. */
  hashForView: (view: TView) => string
  /** Extra slice fields merged into the store (e.g. staking periods). */
  extra?: TExtra | ((set: StoreApi<DappSubviewState<TView> & TExtra>['setState']) => TExtra)
}

function writeHash(hash: string) {
  const next = hash.startsWith('#') ? hash.slice(1) : hash
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

/**
 * Factory for isomorphic DApp tab view stores (hub ↔ subview + enter/exit motion).
 * Each tab still owns its hash map + optional extra fields.
 */
export function createDappSubviewStore<TView extends string, TExtra extends object = object>(
  options: CreateDappSubviewStoreOptions<TView, TExtra>,
): UseBoundStore<StoreApi<DappSubviewState<TView> & TExtra>> {
  const { hub, hashForView } = options
  let transitionTimer: number | null = null

  function clearTransitionTimer() {
    if (transitionTimer !== null) {
      window.clearTimeout(transitionTimer)
      transitionTimer = null
    }
  }

  function syncHash(view: TView) {
    writeHash(hashForView(view))
  }

  return create<DappSubviewState<TView> & TExtra>((set, get) => {
    const extra =
      typeof options.extra === 'function' ? options.extra(set) : ((options.extra ?? {}) as TExtra)

    return {
      ...extra,
      view: hub,
      motion: false,
      direction: 'forward',
      outgoingView: null,
      incomingView: null,
      hasSubviewHistory: false,
      setView: (view) => {
        const { view: currentView, motion } = get()
        if (view === currentView && !motion) {
          syncHash(view)
          return
        }
        if (motion) return

        const outgoingView = currentView
        const back = view === hub && outgoingView !== hub
        const leavingHub = outgoingView === hub && view !== hub

        clearTransitionTimer()
        set({
          view,
          motion: true,
          direction: back ? 'back' : 'forward',
          outgoingView,
          incomingView: view,
          ...(leavingHub ? { hasSubviewHistory: true } : null),
        } as Partial<DappSubviewState<TView> & TExtra>)
        syncHash(view)

        transitionTimer = window.setTimeout(() => {
          set({
            motion: false,
            outgoingView: null,
            incomingView: null,
          } as Partial<DappSubviewState<TView> & TExtra>)
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
          hasSubviewHistory: view !== hub,
        } as Partial<DappSubviewState<TView> & TExtra>)
      },
      backToHub: (backOptions) => {
        clearTransitionTimer()
        set({
          view: hub,
          motion: false,
          direction: 'forward',
          outgoingView: null,
          incomingView: null,
          hasSubviewHistory: false,
        } as Partial<DappSubviewState<TView> & TExtra>)
        if (backOptions?.syncHash !== false) {
          syncHash(hub)
        }
      },
    }
  })
}
