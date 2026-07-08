/** DApp icon sizes — `tokens/theme.css` (`--app-icon-*`). */
export const dappIconClass = {
  xs: 'size-[var(--app-icon-xs)]',
  sm: 'size-[var(--app-icon-sm)]',
  md: 'size-[var(--app-icon-md)]',
  base: 'size-[var(--app-icon-base)]',
  action: 'size-[var(--app-icon-action)]',
  lg: 'size-[var(--app-icon-lg)]',
  xl: 'size-[var(--app-icon-xl)]',
  rail: 'size-[var(--app-icon-rail)]',
  token: 'size-[var(--app-icon-token)]',
  brand: 'size-[var(--app-icon-brand)]',
} as const

export type DappIconSize = keyof typeof dappIconClass
