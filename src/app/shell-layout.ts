import { cn } from '~/lib/utils'
import type { DappTab } from '~/app/types'

/** PC 窗口高度：随 dvh 放大，超宽屏用更高比例占满视口 */
const TAB_WINDOW_DVH: Record<DappTab, number> = {
  swap: 90,
  genesis: 89,
  rewards: 96,
  community: 94,
}

const COLLAPSED_WINDOW_DVH = 90

function shellWindowMaxHeightClass(state: {
  tab: DappTab
  detailCollapsed: boolean
}) {
  const dvh = state.detailCollapsed ? COLLAPSED_WINDOW_DVH : TAB_WINDOW_DVH[state.tab]
  return `dapp:max-h-[min(${dvh}dvh,calc(100dvh_-_var(--dapp-shell-chrome-y)))] dapp:h-[min(${dvh}dvh,calc(100dvh_-_var(--dapp-shell-chrome-y)))]`
}

export const shellPageClass = cn(
  'relative flex h-dvh flex-col gap-4 bg-background pt-0 text-muted-foreground',
  'dapp:gap-1.5 dapp:overflow-x-clip dapp:overflow-y-visible',
  'max-dapp:bg-[linear-gradient(180deg,var(--dapp-h5-gradient-top)_0%,var(--background)_25%,var(--background)_100%)]',
  'max-dapp:h-auto max-dapp:min-h-dvh max-dapp:gap-0 max-dapp:overflow-x-clip max-dapp:overflow-y-visible',
)

export function shellStageClass(state: {
  tab: DappTab
  sessionReady: boolean
  detailCollapsed: boolean
}) {
  const { detailCollapsed } = state
  return cn(
    'relative z-1 flex min-h-0 flex-1 flex-col overflow-visible px-0 pb-4',
    'dapp:items-center dapp:justify-start dapp:pb-4',
    detailCollapsed && 'dapp:justify-center dapp:pb-10',
    'max-dapp:flex-none max-dapp:overflow-visible max-dapp:pb-6',
  )
}

export function shellContainerClass() {
  return cn(
    'mx-auto flex h-full min-h-0 w-full flex-col dapp:max-w-none dapp:items-center dapp:px-0',
    'max-dapp:h-auto max-dapp:max-w-sm max-dapp:px-3',
  )
}

export function shellWindowClass(state: {
  tab: DappTab
  sessionReady: boolean
  detailCollapsed: boolean
}) {
  const { sessionReady } = state

  return cn(
    'group/shell mx-auto grid w-full min-h-0 overflow-hidden border border-border bg-card shadow-window dapp:max-w-none',
    'dapp:h-full',
    shellWindowMaxHeightClass(state),
    'rounded-xl',
    !sessionReady && 'shadow-window-compact',
    'max-dapp:flex max-dapp:h-auto max-dapp:max-h-none max-dapp:min-h-0 max-dapp:max-w-none max-dapp:flex-col max-dapp:gap-3',
    'max-dapp:overflow-hidden max-dapp:rounded-2xl max-dapp:border-0 max-dapp:p-4.5 max-dapp:pb-5.5 max-dapp:shadow-card',
  )
}

export function shellRailClass() {
  return cn(
    'relative flex h-full min-h-0 max-h-full flex-col gap-1.5 border-r border-border bg-card px-2 py-3.5',
    'max-dapp:hidden',
  )
}

export function shellRailItemClass(active: boolean) {
  return cn(
    'relative z-1 flex w-full min-h-15 cursor-pointer flex-col items-center justify-center gap-1 rounded-md bg-transparent px-1 py-2.5',
    'text-xs font-normal leading-snug tracking-tight transition-[color] duration-180 ease-out',
    active ? 'text-primary' : 'text-ink-strong hover:bg-background hover:text-foreground',
  )
}

export const shellRailIndicatorClass =
  'pointer-events-none absolute inset-x-2 top-0 z-0 rounded-md bg-accent will-change-[transform,height]'

export const shellRailIconClass =
  'aspect-square size-[var(--dapp-icon-rail)] bg-current'

/** 右侧 detail 列滚动容器；内容 padding 见 DappDetailPage */
export function shellContentClass(detailCollapsed: boolean) {
  return cn(
    'min-h-0 min-w-0 max-h-full overflow-x-hidden bg-card transition-opacity duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'dapp:dapp-scroll-column',
    detailCollapsed
      ? 'pointer-events-none overflow-y-hidden opacity-0'
      : 'overflow-y-auto opacity-100',
    'max-dapp:pointer-events-auto max-dapp:w-full max-dapp:min-h-0 max-dapp:overflow-visible max-dapp:opacity-100',
  )
}

export function shellWidgetClass() {
  return cn(
    'h-full min-h-0 max-h-full overflow-y-auto overflow-x-hidden border-r border-border bg-card px-6 pb-5.5 pt-10',
    'dapp:dapp-scroll-column',
    'max-dapp:h-auto max-dapp:max-h-none max-dapp:w-full max-dapp:overflow-visible max-dapp:border-r-0 max-dapp:border-b-0 max-dapp:p-0',
  )
}

export const shellMobileDrawerClass = 'relative hidden max-dapp:block'

export const shellMobileDrawerSummaryClass = cn(
  'grid aspect-square w-10 cursor-pointer list-none place-items-center rounded-md border border-border bg-card',
)

/** H5 — spacing from hamburger row to page / section title (Figma `62:2`, Rewards widget). */
export const shellMobilePageTitleClass = 'max-dapp:mt-3'

export function shellMobileDrawerItemClass(active: boolean) {
  return cn(
    'flex w-full cursor-pointer items-center gap-3.5 rounded-md px-4 py-3.5',
    'text-sm font-semibold leading-snug tracking-tight transition-[background-color,color] duration-180 ease-out max-dapp:text-sm',
    active ? 'bg-accent text-primary' : 'bg-transparent text-ink-strong',
  )
}

export const shellMobileRailClass = cn('grid gap-0 border-0 p-2', 'flex h-auto max-h-none min-h-0')

export function shellMobileRailItemClass(active: boolean) {
  return cn(shellRailItemClass(active), 'min-h-12 flex-row justify-start px-3 text-xs')
}

export const shellModulePanelClass = cn(
  'flex min-h-full flex-col',
  'max-dapp:h-auto max-dapp:min-h-0',
)

export const shellWidgetRootClass = cn(shellModulePanelClass, 'dapp-panel-enter')
