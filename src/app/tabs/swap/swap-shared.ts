export {
  swapPercentBtnClass as PERCENT_BTN_CLASS,
  swapPercentTrackClass as PERCENT_TRACK_CLASS,
  swapMetaListClass as SWAP_META_LIST_CLASS,
} from '~/app/tabs/swap/swap-layout-tokens'

export const SWAP_META_VALUE_ROW_CLASS = 'inline-flex items-center justify-end gap-1'

export const SWAP_META_ACTION_BTN_CLASS =
  'grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity duration-180 ease-out hover:opacity-80'

export const PERCENTS = [25, 50, 75, 100] as const

export const SWAP_CARD_FLIP_ANIM =
  '[animation:swap-card-flip_320ms_cubic-bezier(.2,.8,.2,1)_both]'
