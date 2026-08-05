import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

/**
 * hub 与子视图切换动画时长，须与 theme.css 中 `--motion-dapp-subview` 一致
 * （另加少量缓冲，确保层在 CSS 动画结束后再卸载）。
 */
const DAPP_VIEW_MOTION_MS = 460

export type DappViewDirection = 'forward' | 'back'

/** DApp 各 Tab 视图仓库共享的子视图导航字段。 */
export type DappSubviewState<TView extends string> = {
  view: TView
  motion: boolean
  direction: DappViewDirection
  outgoingView: TView | null
  incomingView: TView | null
  hasSubviewHistory: boolean
  setView: (view: TView) => void
  /** 由 hash 直接水合——无动画、不写 hash（URL 由调用方负责）。 */
  hydrateView: (view: TView) => void
  backToHub: (options?: { syncHash?: boolean }) => void
}

/** hub 与子视图切换动画切片（浅订阅）。 */
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
  /** 视图对应的 hash 字符串（如 `#/assets/claim`）；由工厂负责写入。 */
  hashForView: (view: TView) => string
  /** 合并进仓库的额外切片字段（如质押周期）。 */
  extra?: TExtra | ((set: StoreApi<DappSubviewState<TView> & TExtra>['setState']) => TExtra)
}

function writeHash(hash: string) {
  const next = hash.startsWith('#') ? hash.slice(1) : hash
  if (window.location.hash.slice(1) !== next) {
    window.location.hash = next
  }
}

/**
 * DApp Tab 视图仓库工厂（hub ↔ 子视图 + 进入/退出动画）
 *
 * 每个 Tab 各自持有 hash 映射与可选扩展字段，保证淡出动画期间状态稳定。
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
        // setView 写 hash → hashchange → syncTabFromHash → 回到本函数。
        // 若在此覆盖 motion，正向进入动画会跳帧；返回 hub 无碍，因为
        // hub 的 hash 不含视图段，不会走进 hydrate。
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
