import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

/**
 * Hub↔subview enter/exit duration — must match `--motion-dapp-subview` in theme.css
 * (+ small buffer so layers unmount after CSS finishes).
 */
const DAPP_VIEW_MOTION_MS = 460

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

/** Hub↔subview motion slice (shallow-subscribed). */
export type DappSubviewMotion<TView extends string = string> = {
  view: TView
  motion: boolean
  direction: DappViewDirection
  outgoingView: TView | null
  incomingView: TView | null
}

export type DappSubviewStoreApi<TView extends string, TExtra extends object = object> = {
  useStore: UseBoundStore<StoreApi<DappSubviewState<TView> & TExtra>>
  useMotion: () => DappSubviewMotion<TView>
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
 * Each tab owns its hash map + optional extra fields — keeps fade-out stable.
 */
export function createDappSubviewStore<TView extends string, TExtra extends object = object>(
  options: CreateDappSubviewStoreOptions<TView, TExtra>,
): DappSubviewStoreApi<TView, TExtra> {
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

  const useStore = create<DappSubviewState<TView> & TExtra>((set, get) => {
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
        const state = get()
        // setView writes the hash → hashchange → syncTabFromHash → here.
        // If we clobber motion, forward enter snaps; back-to-hub is fine because
        // hub hashes omit the view segment and skip hydrate.
        if (state.view === view && !state.motion) return
        if (state.motion && state.incomingView === view) return

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

  function useMotion(): DappSubviewMotion<TView> {
    return useStore(
      useShallow((state) => ({
        view: state.view,
        motion: state.motion,
        direction: state.direction,
        outgoingView: state.outgoingView,
        incomingView: state.incomingView,
      })),
    )
  }

  return { useStore, useMotion }
}
