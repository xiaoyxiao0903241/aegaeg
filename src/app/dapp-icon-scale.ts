/** DApp 图标尺寸工具类 — 对应 `dapp-scale.css` 变量 */
export const dappIconClass = {
  xs: 'size-[var(--dapp-icon-xs)]',
  sm: 'size-[var(--dapp-icon-sm)]',
  md: 'size-[var(--dapp-icon-md)]',
  base: 'size-[var(--dapp-icon-base)]',
  action: 'size-[var(--dapp-icon-action)]',
  lg: 'size-[var(--dapp-icon-lg)]',
  xl: 'size-[var(--dapp-icon-xl)]',
  rail: 'size-[var(--dapp-icon-rail)]',
  token: 'size-[var(--dapp-icon-token)]',
  brand: 'size-[var(--dapp-icon-brand)]',
} as const

export type DappIconSize = keyof typeof dappIconClass
