import { cn } from '~/lib/utils'
import { dappDetailTitleGapClass } from '~/app/dapp-detail-layout'

/** Figma wcol title @ 16px root — 21px / 13px */
export const swapWidgetTitleClass =
  'm-0 text-[1.3125rem] font-semibold leading-normal tracking-[-0.02625em] text-foreground'

export const swapWidgetSubtitleClass =
  'm-0 max-w-[17.5rem] text-[0.8125rem] font-normal leading-[1.4] tracking-[-0.02em] text-ink-strong max-dapp:max-w-none'

export const swapDetailSectionTitleClass = cn(
  'm-0 text-lg font-semibold leading-[1.3] tracking-[-0.04em] text-foreground',
  'max-dapp:text-base max-dapp:tracking-[-0.04em]',
  dappDetailTitleGapClass,
)

export const swapDetailBlockGapClass = 'mt-8.5 max-dapp:mt-6'

export const swapAboutCardOffsetClass = 'pt-2.5'

/** Figma `4172:766` mode card — p-14, gap-12, border, rounded-16 */
export const swapModeCardClass =
  'flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left shadow-none'

export const swapModeCardInteractiveClass = cn(
  'cursor-pointer transition-[border-color,transform] duration-180 ease-out',
  'hover:-translate-y-px hover:border-primary',
)

export const swapModeCardTitleClass =
  'text-[0.8125rem] font-semibold leading-normal tracking-[-0.02em] text-foreground'

export const swapModeCardBodyClass =
  'text-[0.8125rem] font-normal leading-normal tracking-[-0.02em] text-muted-foreground'

/** Figma `4172:794` — px-8 py-6, 10px medium white */
export const swapModeCardBadgeClass =
  'inline-flex shrink-0 items-center justify-center rounded-full bg-[#FF9500] px-2 py-1.5 text-[0.625rem] font-medium leading-none tracking-[-0.02em] text-white'

/** Figma `4172:869` program card — p-16, gap-8 rows, shadow 8/24 */
export const swapProgramCardClass = 'flex w-full rounded-2xl bg-card p-4 text-left shadow-card'

export const swapProgramCardInteractiveClass = cn(
  'cursor-pointer transition-[transform,box-shadow] duration-180 ease-out',
  'hover:-translate-y-px',
)

export const swapProgramCardTitleClass =
  'text-[0.8125rem] font-semibold leading-[1.3] tracking-[0.08em] text-foreground'

export const swapProgramCardBodyClass =
  'text-xs font-normal leading-[1.3] tracking-[-0.03em] text-muted-foreground'

export const swapMetaListClass = 'rounded-xl px-3.5 py-3.25'

export const swapPercentTrackClass = 'grid grid-cols-4 gap-1.5 pt-2.5 max-dapp:mt-3 max-dapp:py-0'

export const swapMetricCardClass =
  'rounded-2xl px-4 py-3.5 shadow-card max-dapp:min-w-0 max-dapp:gap-1.5 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2]'

export const swapPercentBtnClass = cn(
  'flex cursor-pointer items-center justify-center rounded-[0.5625rem] border border-border bg-card py-1.25',
  'text-xs font-semibold leading-normal tracking-[-0.02em] text-ink-strong',
  'transition-[border-color,color,transform] duration-180 ease-out',
  'hover:-translate-y-px hover:border-primary hover:text-primary',
  'disabled:pointer-events-none disabled:opacity-55',
  'max-dapp:h-auto max-dapp:py-1.5',
)
