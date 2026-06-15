import { surfacePillHoverClass } from '~/lib/chip-styles'
import { cn } from '~/lib/utils'

const DAPP_CARD_KIND = {
  side: 'mt-3.5 rounded-md border border-border px-4 py-3.5',
  metric: 'flex flex-col items-start rounded-[18px] p-[18px] shadow-card',
  communityStat: 'flex flex-col items-start rounded-[18px] p-[18px] shadow-card',
  program: 'grid gap-2 rounded-md p-5 shadow-card',
  table: 'mt-3.5 overflow-x-auto max-w-full min-w-0 rounded-md px-4 py-[5.75px] shadow-card',
  swapForm: 'mt-3.5 rounded-md border border-border px-4 py-3.5 max-[820px]:mt-3',
  metaList:
    'mt-3.5 grid shrink-0 gap-2 rounded-xl border border-border bg-card px-3.5 py-[13px] tracking-[-0.26px] max-[820px]:mt-3',
  faq: 'rounded-md border border-border px-[18px] shadow-card',
  promo: 'mt-auto grid gap-[5px] rounded-md bg-dark px-[18px] py-4 text-white',
  rewardBalance: 'mt-3.5 rounded-md border border-border px-4 py-3.5',
} as const

const DAPP_CARD_TONE = {
  surface: '',
  dark: 'bg-dark text-white',
  coralSoft: 'bg-accent',
  dashed: 'border border-dashed border-border bg-surface-wash-strong',
} as const

export function dappCardClass(
  kind: keyof typeof DAPP_CARD_KIND,
  opts?: { tone?: keyof typeof DAPP_CARD_TONE; className?: string },
) {
  return cn(
    kind !== 'metaList' && 'overflow-hidden',
    'bg-card',
    DAPP_CARD_KIND[kind],
    opts?.tone && DAPP_CARD_TONE[opts.tone],
    opts?.className,
  )
}

const DAPP_TEXT = {
  sideLabel: 'm-0 text-xs font-normal leading-[1.5]',
  sideValue: 'mt-2 block text-[13px] font-semibold leading-[1.3]',
  sideKicker: 'm-0 text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.88px]',
  sideTitle: 'mt-1.5 block text-[17px] font-semibold leading-[1.3]',
  sideHint: 'mt-1.5 block text-xs font-normal leading-[1.5]',
  metricLabel: 'text-xs font-normal leading-[1.5]',
  metricValue: 'mt-1.5 text-[22px] font-bold leading-[1.18]',
  metricValueSm: 'mt-[5px] text-base font-semibold leading-[1.3]',
  metricHint: 'mt-[7px] text-xs leading-[1.5]',
  communityLabel: 'text-xs font-normal leading-[1.5]',
  communityValue: 'mt-1 text-[30px] font-semibold leading-[1.2]',
  communityVolume: 'mt-1 text-sm font-semibold leading-[1.2]',
  communityHint: 'mt-1 text-xs leading-[1.5]',
  programKicker: 'text-[11px] font-semibold leading-[1.3] tracking-[0.88px]',
  programTitle: 'mt-2 max-w-[34ch] text-base font-semibold leading-[1.3]',
  programBody: 'mt-2 max-w-[38ch] text-[13px] leading-[1.5]',
  sectionTitle: 'm-0 text-[18px] font-semibold leading-[1.3]',
  pillTab: 'text-[13px] font-semibold leading-[1.3]',
  panelBody: 'm-0 text-xs leading-[1.5]',
  formLabel: 'text-[13px] font-normal leading-[1.5]',
  formHint: 'text-[13px] font-normal leading-[1.5]',
  metaLabel: 'text-[13px] font-normal leading-[1.5] text-ink-strong',
  metaValue: 'mt-0 text-right text-[13px] font-semibold leading-[1.3] text-foreground',
  widgetTitle: 'm-0 text-[21px] font-semibold leading-[1.3]',
  widgetIntro: 'm-0 mt-1.5 max-w-[34ch] text-[13px] leading-[1.4]',
  rewardBalanceLabel: 'm-0 text-xs font-normal leading-[1.5]',
  rewardBalanceValue: 'mt-2 block text-[22px] font-bold leading-[1.32]',
  rewardBalanceHint:
    'mt-1.5 block max-w-full text-xs leading-[1.5] tracking-[-0.24px] whitespace-nowrap',
  rewardBalanceBadge: 'text-xs font-bold not-italic leading-[1.3] whitespace-nowrap',
  faqSummary:
    'flex cursor-pointer items-center justify-between gap-4 py-4 text-[13px] font-semibold',
  faqAnswer: 'mb-4 mt-0 text-xs leading-[1.6]',
  tokenChip: 'text-sm font-semibold leading-[1.2]',
} as const

const DAPP_TEXT_TONE = {
  ink: 'text-foreground',
  body: 'text-muted-foreground',
  muted: 'text-faint',
  coral: 'text-primary',
  up: 'text-success',
  inverse: 'text-white',
  onDark: 'text-on-dark',
  coralBright: 'text-coral-bright',
} as const

export function dappTextClass(
  variant: keyof typeof DAPP_TEXT,
  opts?: { tone?: keyof typeof DAPP_TEXT_TONE; className?: string },
) {
  return cn('tracking-[0]', DAPP_TEXT[variant], opts?.tone && DAPP_TEXT_TONE[opts.tone], opts?.className)
}

export const dappLayout = {
  metricGridTwo:
    'mt-3.5 grid grid-cols-2 gap-3.5 max-[820px]:min-w-0 max-[820px]:grid-cols-1',
  metricGridFour:
    'mt-3.5 grid grid-cols-4 gap-3.5 max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] max-[820px]:min-w-0 max-[820px]:grid-cols-1',
  formRow: 'flex items-center justify-between gap-3',
  tokenAmountRow:
    'mt-[9px] flex items-center justify-between gap-3 max-[820px]:items-start',
  amountInput:
    'w-full min-w-0 border-0 bg-transparent text-right text-[22px] font-bold leading-[1.2] text-foreground outline-0 placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-[.58]',
  metaRow: 'm-0 flex items-start justify-between gap-3',
  actionRow: 'mt-3.5 grid shrink-0 grid-cols-2 gap-[9px] max-[820px]:mt-3',
  seasonOptions: 'mt-3.5 grid gap-2',
  seasonOption:
    'flex items-center gap-[11px] rounded-[13px] border border-border bg-card px-3.5 py-3 data-[selected=true]:border-primary',
  seasonRadio:
    'relative aspect-square w-[17px] flex-none rounded-full border-2 border-border bg-card data-[selected=true]:border-primary',
  seasonRadioDot: 'absolute inset-[3px] rounded-full bg-primary',
  seasonBody: 'min-w-0 flex-1',
  seasonTitle: 'block text-[13px] font-bold leading-[1.25] text-foreground',
  seasonMeta: 'mt-[3px] block text-[11px] leading-[1.35] text-faint',
  seasonMetaDesktop: 'max-[820px]:hidden [&_b]:font-inherit [&_b]:text-primary [&_i]:not-italic [&_i]:text-on-dark',
  seasonMetaMobile: 'hidden max-[820px]:inline [&_b]:font-inherit [&_b]:text-primary',
  seasonTiming: 'grid flex-none justify-items-end gap-1',
  seasonStatus:
    'rounded-full bg-pill-muted-bg px-2 py-[3px] text-[10px] font-bold not-italic leading-[1.2] text-faint whitespace-nowrap data-[selected=true]:bg-primary data-[selected=true]:text-white',
  quickLinks: 'mt-3.5 grid gap-2',
  quickLink:
    'flex items-center gap-3 rounded-[14px] border border-border-subtle bg-card px-3.5 py-[13px] text-sm font-semibold leading-[1.3] text-foreground transition-[border-color,transform] duration-[180ms] ease-out hover:translate-x-0.5 hover:border-coral-hover-border',
  quickLinkIcon:
    'grid aspect-square w-[30px] flex-none place-items-center rounded-full bg-primary text-white',
  quickLinkIconDark: 'bg-foreground',
  quickLinkIconPlain: 'bg-transparent',
  inviteFlow:
    'mt-3.5 grid grid-cols-3 gap-0 overflow-hidden rounded-md bg-card p-[22px] shadow-card max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] max-[1100px]:gap-4 max-[820px]:min-w-0 max-[820px]:grid-cols-1 max-[820px]:gap-3.5 max-[820px]:p-4 group-data-[tab=community]/shell:gap-3.5 group-data-[tab=community]/shell:p-4 group-data-[tab=community]/shell:max-[820px]:gap-3.5',
  inviteFlowItem:
    'min-w-0 px-1 max-[820px]:grid max-[820px]:grid-cols-[28px_minmax(0,1fr)] max-[820px]:gap-x-3 max-[820px]:px-0',
  inviteFlowTop: 'flex items-center gap-2.5 max-[820px]:items-start',
  inviteFlowStep:
    'grid aspect-square w-[30px] flex-none place-items-center rounded-full bg-primary text-[13px] font-semibold text-white max-[820px]:w-7 max-[820px]:rounded-[14px]',
  inviteFlowLine:
    'h-0.5 flex-1 rounded-sm bg-[linear-gradient(90deg,var(--primary),var(--border))] max-[820px]:hidden data-[tone=primary]:!bg-primary data-[tone=muted]:!bg-border',
  inviteFlowTitle:
    'm-0 mt-2 text-sm font-semibold leading-[1.3] text-foreground max-[820px]:col-start-2 max-[820px]:row-start-1 max-[820px]:mt-0',
  inviteFlowBody:
    'm-0 mt-2 max-w-[24ch] text-xs leading-[1.5] text-muted-foreground max-[820px]:col-start-2 max-[820px]:row-start-2 max-[820px]:mt-[3px] max-[820px]:max-w-none max-[820px]:leading-[1.35] group-data-[tab=community]/shell:max-[820px]:line-clamp-2 group-data-[tab=community]/shell:max-[820px]:text-[13px] group-data-[tab=community]/shell:max-[820px]:leading-[1.28]',
  tableCell:
    'border-b-[0.5px] border-border py-2.5 text-left whitespace-nowrap font-normal',
  tableWrapCompact: '[&_table]:min-w-full',
  tableHighlightedRow: 'bg-accent [&_td]:font-normal [&_td]:text-foreground [&_td:first-child]:text-primary [&_td.text-success]:text-success',
  tableAddressCell: 'text-primary',
  tableEmphasisCell: 'font-bold text-foreground',
  tablePositiveCell: 'font-bold text-success',
  tableStatusBadge:
    'inline-flex items-center rounded-full bg-status-success-bg px-[9px] py-0.5 text-[11px] font-bold text-success',
  faqChevron:
    'inline-block aspect-square w-[18px] rotate-180 flex-none bg-primary transition-transform duration-[220ms] ease-[cubic-bezier(.2,.8,.2,1)] [mask:url("/assets/figma/dapp/ic-chevron.svg")_center/contain_no-repeat]',
  amountMobilePreview:
    'hidden text-[22px] font-bold leading-[1.2] text-foreground whitespace-nowrap max-[820px]:block',
  pillTabs: 'flex flex-wrap items-center gap-2',
} as const

const DAPP_BTN_KIND = {
  action: 'min-h-[44px] w-full whitespace-nowrap rounded-full text-[14px] leading-normal max-[820px]:min-h-[46px]',
  capsule: 'min-h-10 rounded-full px-5 text-[13px] leading-[1.3]',
  pill: 'min-h-[31px] rounded-full px-4 text-[13px] leading-[1.3]',
  icon: 'grid aspect-square place-items-center',
  link: 'border-0 bg-transparent p-0 text-left font-[inherit] text-[13px] leading-[1.3]',
  panelToggle: 'grid aspect-square w-[42px] flex-none rounded-[13px] max-[820px]:hidden',
} as const

const DAPP_BTN_TONE = {
  primary:
    'border border-transparent bg-primary text-primary-foreground hover:-translate-y-px hover:shadow-primary-hover focus-visible:-translate-y-px focus-visible:shadow-primary-hover',
  secondary:
    'gap-[7px] border border-border bg-card text-foreground hover:-translate-y-px hover:shadow-card focus-visible:-translate-y-px focus-visible:shadow-card',
  subtle:
    'border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary',
  active: 'border border-transparent bg-accent text-primary',
  text: 'text-primary',
  light:
    'gap-[7px] border border-border bg-card text-foreground hover:shadow-card focus-visible:shadow-card',
  panel:
    'border border-border bg-card text-foreground hover:-translate-y-px focus-visible:-translate-y-px',
} as const

const SURFACE_BORDER_TONES = new Set<keyof typeof DAPP_BTN_TONE>(['secondary', 'light', 'panel'])

export function dappButtonClass(
  kind: keyof typeof DAPP_BTN_KIND,
  tone: keyof typeof DAPP_BTN_TONE,
  className?: string,
) {
  return cn(
    'inline-flex cursor-pointer items-center justify-center font-semibold tracking-[0] transition-[border-color,background-color,box-shadow,transform] duration-[180ms] ease-out',
    DAPP_BTN_KIND[kind],
    DAPP_BTN_TONE[tone],
    SURFACE_BORDER_TONES.has(tone) && surfacePillHoverClass,
    className,
  )
}
