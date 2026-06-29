/** Standalone table / empty-state card — matches Figma elevated surface (PC + H5). */
export const dappTableCardShellClass =
  'overflow-hidden rounded-2xl border border-border bg-card shadow-card'

/** Horizontal row dividers on all breakpoints. */
export const dappTableGridLineClass = 'border-border'

export const dappTableCellBorderClass = `border-b-[0.5px] ${dappTableGridLineClass}`

export const dappTableSectionDividerClass = 'border-border/50'

/** Community members table — column widths sized to typical cell content. */
export const communityInviteColWidths = [
  '6.5rem',
  '6.5rem',
  '6.5rem',
  '5.5rem',
  '6rem',
  '7.5rem',
] as const

/** Horizontal padding for table body inside `DappTableCard` (no header — Figma `tbl` py 6). */
export const dappTableContentPaddingClass =
  'dapp:px-4 dapp:py-1.5 max-dapp:px-3.5 max-dapp:py-1.5'

/** Table body when card has a header row (tabs) — Figma gap 10 below tabs. */
export const dappTableContentBelowHeaderPaddingClass =
  'dapp:px-4 dapp:pb-1.5 dapp:pt-0 max-dapp:px-3.5 max-dapp:pb-1.5 max-dapp:pt-0'

export const dappTableHeaderPaddingClass =
  'dapp:px-4 dapp:pt-3.5 dapp:pb-2.5 max-dapp:px-3.5 max-dapp:pt-3.5 max-dapp:pb-2.5'

export const dappTableFooterPaddingClass =
  'dapp:px-4 dapp:py-3 max-dapp:px-3.5 max-dapp:py-2.5'

/** Table column widths @ 16px root — scales with site-fluid. */
export const genesisContributionsColWidths = [
  '8.25rem',
  '6.5rem',
  '6rem',
  '8.5rem',
  '6.5rem',
] as const

export const rewardsReferralHistoryColWidths = [
  '8.25rem',
  '6.5rem',
  '8.75rem',
  '7.5rem',
  '6.5rem',
] as const

export const rewardsTeamHistoryColWidths = ['10rem', '7.5rem', '10rem', '10rem'] as const

export const dappTableCellMinWidthClass = 'min-w-[var(--dapp-table-cell-min-width)]'
