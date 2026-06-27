/** Standalone table / empty-state card — matches Figma elevated surface (PC + H5). */
export const dappTableCardShellClass =
  'overflow-hidden rounded-2xl border border-border bg-card shadow-card'

/** Horizontal row dividers on all breakpoints. */
export const dappTableGridLineClass = 'border-border'

export const dappTableCellBorderClass = `border-b-[0.5px] ${dappTableGridLineClass}`

export const dappTableSectionDividerClass = 'border-border/50'

/** Community invite table — equal column widths on PC; auto on H5 scroll. */
export const communityInviteTableClass =
  '[&_table]:w-full [&_table]:table-fixed [&_th]:w-[16.666%] [&_td]:w-[16.666%] max-dapp:[&_table]:w-max max-dapp:[&_table]:table-auto max-dapp:[&_th]:w-auto max-dapp:[&_td]:w-auto'

/** Horizontal padding for table body inside `DappTableCard`. */
export const dappTableContentPaddingClass =
  'dapp:px-5 dapp:py-1.5 max-dapp:px-3.5 max-dapp:py-1.5'

export const dappTableHeaderPaddingClass =
  'dapp:px-5 dapp:pt-4 dapp:pb-3 max-dapp:px-3.5 max-dapp:pt-3.5 max-dapp:pb-2.5'

export const dappTableFooterPaddingClass =
  'dapp:px-5 dapp:py-3 max-dapp:px-3.5 max-dapp:py-2.5'
