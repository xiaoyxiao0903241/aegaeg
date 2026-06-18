import { cn } from '~/lib/utils'
import type { DappTab } from '~/app/types'

/** Figma 设计稿窗口高度上限（px）——大屏不无限拉伸，小屏随视口收缩。 */
const TAB_WINDOW_HEIGHT: Record<DappTab, number> = {
  swap: 826,
  genesis: 820,
  rewards: 1028,
  community: 985,
}

const COLLAPSED_WINDOW_HEIGHT = 826

function shellWindowMaxHeightClass(state: {
  tab: DappTab
  detailCollapsed: boolean
}) {
  const design = state.detailCollapsed ? COLLAPSED_WINDOW_HEIGHT : TAB_WINDOW_HEIGHT[state.tab]
  return `dapp:max-h-[min(100%,${design}px)]`
}

export const shellPageClass = cn(
  'relative flex h-dvh flex-col gap-4 bg-background pt-0 text-muted-foreground',
  'dapp:gap-5 dapp:overflow-x-clip dapp:overflow-y-visible',
  'max-dapp:bg-[linear-gradient(180deg,var(--dapp-h5-gradient-top)_0%,var(--background)_25%,var(--background)_100%)]',
  'max-dapp:h-auto max-dapp:min-h-dvh max-dapp:gap-4 max-dapp:overflow-x-clip max-dapp:overflow-y-visible',
)

export function shellStageClass(state: {
  tab: DappTab
  sessionReady: boolean
  detailCollapsed: boolean
  mobileSwapPager?: boolean
}) {
  return cn(
    'relative z-1 flex min-h-0 flex-1 flex-col overflow-visible px-0 pb-4 dapp:pt-1',
    state.detailCollapsed && 'dapp:justify-center dapp:pb-10',
    !state.detailCollapsed &&
      state.sessionReady &&
      state.tab === 'swap' &&
      'dapp:justify-center dapp:pb-10',
    state.mobileSwapPager
      ? 'max-dapp:flex max-dapp:min-h-0 max-dapp:flex-1 max-dapp:overflow-x-visible max-dapp:overflow-y-hidden max-dapp:pb-0'
      : 'max-dapp:flex-none max-dapp:overflow-visible max-dapp:pb-6',
  )
}

export function shellContainerClass(mobileSwapPager = false) {
  return cn(
    'mx-auto flex h-full min-h-0 w-[min(calc(100%-48px),1320px)] flex-col',
    mobileSwapPager
      ? 'max-dapp:w-[min(calc(100%-24px),378px)] max-dapp:min-h-0 max-dapp:flex-1'
      : 'max-dapp:h-auto max-dapp:w-[min(calc(100%-24px),378px)]',
  )
}

export function shellWindowClass(state: {
  tab: DappTab
  sessionReady: boolean
  detailCollapsed: boolean
  mobileSwapPager?: boolean
}) {
  const { sessionReady, mobileSwapPager } = state

  return cn(
    'group/shell mx-auto grid w-full min-h-0 max-w-[1320px] overflow-hidden border border-border bg-card shadow-window',
    'dapp:h-full',
    shellWindowMaxHeightClass(state),
    'rounded-xl',
    !sessionReady && 'shadow-window-compact',
    'max-dapp:flex max-dapp:h-auto max-dapp:max-h-none max-dapp:min-h-0 max-dapp:flex-col max-dapp:gap-3',
    'max-dapp:overflow-hidden max-dapp:rounded-[24px] max-dapp:border-0 max-dapp:p-[18px] max-dapp:pb-[22px] max-dapp:shadow-card',
    mobileSwapPager &&
      'max-dapp:flex max-dapp:h-full max-dapp:max-h-full max-dapp:min-h-0 max-dapp:flex-1 max-dapp:gap-0 max-dapp:overflow-x-visible max-dapp:overflow-y-hidden max-dapp:px-0 max-dapp:pb-[18px] max-dapp:pt-[18px]',
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
    'relative z-1 flex w-full min-h-[60px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[14px] bg-transparent px-1 py-[11px]',
    'text-[10px] font-normal leading-[1.3] tracking-[-0.2px] transition-[color] duration-180 ease-out',
    active ? 'text-primary' : 'text-ink-strong hover:bg-background hover:text-foreground',
  )
}

export const shellRailIndicatorClass =
  'pointer-events-none absolute inset-x-2 top-0 z-0 rounded-[14px] bg-accent will-change-[transform,height]'

export const shellRailIconClass = 'aspect-square w-[22px] bg-current'

/** 右侧 detail 列滚动容器；内容 padding 见 DappDetailPage */
export function shellContentClass(detailCollapsed: boolean) {
  return cn(
    'min-h-0 min-w-0 max-h-full overflow-y-auto overflow-x-hidden bg-card transition-opacity duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    detailCollapsed && 'pointer-events-none overflow-hidden opacity-0',
    'max-dapp:pointer-events-auto max-dapp:w-full max-dapp:min-h-0 max-dapp:overflow-visible max-dapp:opacity-100',
  )
}

export function shellWidgetClass() {
  return cn(
    'h-full min-h-0 max-h-full overflow-y-auto overflow-x-hidden border-r border-border bg-card pt-10 px-6 pb-[22px]',
    'max-dapp:h-auto max-dapp:max-h-none max-dapp:w-full max-dapp:overflow-visible max-dapp:border-r-0 max-dapp:border-b-0 max-dapp:p-0',
  )
}

export const shellMobileDrawerClass = 'relative hidden max-dapp:block'

export const shellMobileDrawerSummaryClass = cn(
  'grid aspect-square w-[42px] cursor-pointer list-none place-items-center rounded-[13px] border border-border bg-card',
)

/** H5 — spacing from hamburger row to page / section title (Figma `62:2`, Rewards widget). */
export const shellMobilePageTitleClass = 'max-dapp:mt-3'

export function shellMobileDrawerItemClass(active: boolean) {
  return cn(
    'flex w-full cursor-pointer items-center gap-3.5 rounded-[14px] px-4 py-3.5',
    'text-[15px] font-semibold leading-[1.3] tracking-[-0.3px] transition-[background-color,color] duration-180 ease-out',
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
