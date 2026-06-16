import { surfacePillHoverClass } from '~/lib/chip-styles'
import { cn } from '~/lib/utils'

/**
 * DApp design guideline — spacing rhythm + surface tokens.
 * Compose with `dappSurfaceClass()` / `dappTextClass()`; page tweaks via `cn()`.
 */
export const dappSpacing = {
  widgetCol: 'pt-10 px-6 pb-[22px]',
  contentCol: 'pt-10 px-7 pb-[30px]',
  stackAfterHeader: 'mt-3.5',
  stackBetweenCards: 'mt-2',
  actionAfterMeta: 'pt-3.5',
} as const

export const dappGap = {
  sm: 'gap-2',
  md: 'gap-2.5',
  metric: 'gap-[7px]',
  stat: 'gap-1',
  section: 'gap-3',
} as const

export const dappPad = {
  widget: 'px-4 py-3.5',
  uniform: 'p-4',
  field: 'p-[14px]',
  program: 'p-5',
  meta: 'px-[14px] py-[13px]',
  faq: 'px-[18px]',
  promo: 'px-[18px] py-4',
  table: 'px-4 py-[5.75px]',
  stat: 'p-[18px]',
} as const

export const dappRadius = {
  sm: 'rounded-[12px]',
  md: 'rounded-md',
  lg: 'rounded-[18px]',
} as const

export const dappShadow = {
  card: 'shadow-card',
  faq: 'shadow-faq',
  stat: 'shadow-[0_8px_24px_rgba(18,26,51,0.06)]',
} as const

const BORDERED = 'border border-border'

const DAPP_SURFACE_TONE = {
  surface: '',
  dark: 'bg-dark text-white',
  coralSoft: 'bg-accent',
  dashed: 'border border-dashed border-border bg-surface-wash-strong',
} as const

type DappSurfaceGap = keyof typeof dappGap | false
type DappSurfaceLayout = 'table' | false

export type DappSurfaceOptions = {
  border?: boolean
  pad?: keyof typeof dappPad
  radius?: keyof typeof dappRadius
  shadow?: keyof typeof dappShadow | false
  stack?: 'header' | 'between' | false
  gap?: DappSurfaceGap
  layout?: DappSurfaceLayout
  tone?: keyof typeof DAPP_SURFACE_TONE
  clip?: boolean
  className?: string
}

/** Guideline surface builder — prefer this + `cn()` over one-off card strings. */
export function dappSurfaceClass(opts: DappSurfaceOptions = {}) {
  const {
    border = false,
    pad = 'widget',
    radius = 'md',
    shadow = false,
    stack = false,
    gap = false,
    layout = false,
    tone,
    clip = true,
    className,
  } = opts

  return cn(
    'bg-card',
    clip && 'overflow-hidden',
    stack === 'header' && dappSpacing.stackAfterHeader,
    stack === 'between' && dappSpacing.stackBetweenCards,
    border && BORDERED,
    gap === 'sm' && 'flex flex-col',
    gap === 'md' && 'flex flex-col',
    gap === 'metric' && 'flex flex-col items-start',
    gap === 'stat' && 'flex flex-col items-start',
    gap && gap !== false && dappGap[gap],
    layout === 'table' && 'overflow-x-auto max-w-full min-w-0',
    dappRadius[radius],
    shadow && dappShadow[shadow],
    dappPad[pad],
    tone && DAPP_SURFACE_TONE[tone],
    className,
  )
}

/** Named presets — thin data; override with `dappCardClass(kind, { className })`. */
const DAPP_SURFACE_PRESET: Record<string, DappSurfaceOptions> = {
  side: { border: true, stack: 'header', gap: 'sm', pad: 'widget' },
  rewardBalance: { border: true, stack: 'header', pad: 'widget' },
  referrerBound: { border: true, stack: 'between', gap: 'md', pad: 'uniform' },
  swapForm: { border: true, stack: 'header', pad: 'field' },
  metric: { stack: 'header', gap: 'metric', pad: 'widget', shadow: 'card' },
  table: { stack: 'header', pad: 'table', shadow: 'card', layout: 'table' },
  communityStat: { gap: 'stat', radius: 'lg', pad: 'stat', shadow: 'stat' },
  program: { gap: 'sm', pad: 'program', shadow: 'card' },
  metaList: {
    border: true,
    stack: 'header',
    radius: 'sm',
    pad: 'meta',
    clip: false,
    className: 'grid shrink-0 gap-2 tracking-[-0.26px] max-[820px]:mt-3',
  },
  faq: { pad: 'faq', shadow: 'faq' },
  promo: {
    pad: 'promo',
    className: 'mt-auto grid gap-[5px] bg-dark text-white',
  },
}

export function dappCardClass(
  kind: keyof typeof DAPP_SURFACE_PRESET,
  opts?: { tone?: keyof typeof DAPP_SURFACE_TONE; className?: string },
) {
  return dappSurfaceClass({
    ...DAPP_SURFACE_PRESET[kind],
    tone: opts?.tone,
    className: cn(DAPP_SURFACE_PRESET[kind].className, opts?.className),
  })
}

/** H5 / tab-specific tweaks — attach via `cn(dappResponsive.metricCard, className)`. */
export const dappResponsive = {
  metricCard: cn(
    'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:rounded-[14px] group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:p-3.5',
    'group-data-[tab=genesis]/shell:max-[820px]:min-h-[70px] group-data-[tab=genesis]/shell:max-[820px]:rounded-md group-data-[tab=genesis]/shell:max-[820px]:p-3.5',
  ),
  metricValue: cn(
    'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:text-[13px] group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:leading-[1.2]',
    'group-data-[tab=genesis]/shell:text-base group-data-[tab=genesis]/shell:leading-[1.3] group-data-[tab=genesis]/shell:max-[820px]:text-[15px] group-data-[tab=genesis]/shell:max-[820px]:leading-[1.2]',
  ),
  metricHintHidden: cn(
    'group-data-[tab=swap]/shell:group-data-[connected=false]/shell:py-3.5 group-data-[tab=swap]/shell:group-data-[connected=false]/shell:max-[820px]:hidden',
    'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:hidden',
    'group-data-[tab=genesis]/shell:max-[820px]:hidden',
  ),
  communityStatCard: cn(
    'group-data-[tab=community]/shell:max-[820px]:min-h-[70px] group-data-[tab=community]/shell:max-[820px]:rounded-xl group-data-[tab=community]/shell:max-[820px]:p-3.5',
    'group-data-[tab=community]/shell:max-[820px]:items-center group-data-[tab=community]/shell:max-[820px]:text-center',
    'group-data-[tab=community]/shell:max-[820px]:[&:not(.is-dark)>span]:text-xs group-data-[tab=community]/shell:max-[820px]:[&:not(.is-dark)>span]:leading-[1.35] group-data-[tab=community]/shell:max-[820px]:[&:not(.is-dark)>span]:text-faint',
    'group-data-[tab=community]/shell:max-[820px]:[&.is-dark>span]:text-xs group-data-[tab=community]/shell:max-[820px]:[&.is-dark>span]:leading-[1.35] group-data-[tab=community]/shell:max-[820px]:[&.is-dark>span]:text-on-dark',
    'group-data-[tab=community]/shell:max-[820px]:[&>strong]:mt-[3px] group-data-[tab=community]/shell:max-[820px]:[&>strong]:text-2xl group-data-[tab=community]/shell:max-[820px]:[&>strong]:leading-[1.05]',
    'group-data-[tab=community]/shell:max-[820px]:[&>b]:hidden group-data-[tab=community]/shell:max-[820px]:[&>small]:hidden',
    'group-data-[tab=community]/shell:max-[820px]:[&.is-dark>small]:hidden',
    'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:min-h-[90px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:items-start group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:rounded-[14px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:border-0 group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:p-[13px_12px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-left group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:shadow-card',
  ),
  communityStatLabel: cn(
    'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:leading-normal',
  ),
  communityStatValue: cn(
    'group-data-[tab=community]/shell:max-[820px]:mt-[3px] group-data-[tab=community]/shell:max-[820px]:text-2xl group-data-[tab=community]/shell:max-[820px]:leading-[1.05]',
    'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-2xl',
  ),
  communityStatVolume: cn(
    'group-data-[tab=community]/shell:max-[820px]:hidden',
    'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:block group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:leading-[1.2]',
  ),
  communityStatHint: cn(
    'group-data-[tab=community]/shell:max-[820px]:hidden',
    'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:block group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:leading-[1.2]',
    'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:[&.is-dark]:text-on-dark',
  ),
  programCard: cn(
    'max-[820px]:rounded-[14px] max-[820px]:p-4 group-data-[tab=community]/shell:max-[820px]:gap-1.5 group-data-[tab=community]/shell:max-[820px]:py-3',
  ),
  programTitle: 'max-[820px]:text-sm group-data-[tab=community]/shell:max-[820px]:leading-[1.2]',
  rewardBalanceHint: 'group-data-[tab=rewards]/shell:max-[820px]:hidden',
  swapForm: 'max-[820px]:mt-3',
} as const

const TEXT_ROLE = {
  caption: 'm-0 text-xs font-normal leading-[1.5]',
  kicker: 'm-0 text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.88px]',
  body: 'text-[13px] font-normal leading-[1.5]',
  titleSm: 'block text-[17px] font-semibold leading-[1.3]',
  titleMd: 'text-lg font-semibold leading-[1.3] tracking-[-0.36px]',
  titleWidget: 'm-0 text-[21px] font-semibold leading-[1.3]',
  valueSm: 'block text-[13px] font-semibold leading-[1.3]',
  valueMd: 'text-lg font-semibold leading-[1.2] tracking-[-0.36px]',
  valueLg: 'mt-2 block text-[22px] font-bold leading-[1.32]',
  valueStat: 'text-[30px] font-semibold leading-[1.2] tracking-[-1.2px]',
  valueAccent: 'text-sm font-semibold leading-[1.2] tracking-[-0.28px]',
  hint: 'block text-xs font-normal leading-[1.5]',
  hintStat: 'text-xs leading-[1.5] tracking-[-0.12px]',
  metricLabel: 'text-xs font-medium leading-[1.5] tracking-[-0.24px]',
  metricValueSm: 'mt-[5px] text-base font-semibold leading-[1.3]',
  metricHint: 'mt-[7px] text-xs leading-[1.5]',
  pillTab: 'text-[13px] font-semibold leading-[1.3]',
  panelBody: 'm-0 text-xs leading-[1.5]',
  widgetIntro: 'm-0 mt-1.5 max-w-[34ch] text-[13px] leading-[1.4]',
  rewardBadge: 'text-xs font-bold not-italic leading-[1.3] whitespace-nowrap',
  rewardHint: 'mt-1.5 block max-w-full text-xs leading-[1.5] tracking-[-0.24px] whitespace-nowrap',
  faqSummary:
    'flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-semibold leading-[1.3] tracking-[-0.3px]',
  faqAnswer: 'mb-4 mt-0 text-[14px] leading-[1.5] tracking-[-0.28px]',
  tokenChip: 'text-sm font-semibold leading-[1.2]',
  metaValue: 'mt-0 text-right text-[13px] font-semibold leading-[1.3] text-foreground',
} as const

export type DappTextRole = keyof typeof TEXT_ROLE

const DAPP_TEXT_TONE = {
  ink: 'text-foreground',
  body: 'text-ink-strong',
  subtle: 'text-ink-muted',
  muted: 'text-faint',
  coral: 'text-primary',
  up: 'text-success',
  inverse: 'text-white',
  onDark: 'text-on-dark',
  coralBright: 'text-coral-bright',
  faq: 'text-faq-text',
} as const

export function dappTextClass(
  role: DappTextRole,
  opts?: { tone?: keyof typeof DAPP_TEXT_TONE; className?: string },
) {
  return cn('tracking-[0]', TEXT_ROLE[role], opts?.tone && DAPP_TEXT_TONE[opts.tone], opts?.className)
}

export const dappLayout = {
  metricGridTwo:
    'mt-3.5 grid grid-cols-2 gap-3 max-[820px]:min-w-0 max-[820px]:grid-cols-1',
  metricGridFour:
    'mt-3.5 grid grid-cols-4 gap-3 max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] max-[820px]:min-w-0 max-[820px]:grid-cols-1',
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
    'flex items-center gap-3 rounded-[14px] border border-border-subtle bg-card px-[14px] py-[13px] text-[14px] font-semibold leading-[1.3] tracking-[-0.28px] text-foreground transition-[border-color,transform] duration-[180ms] ease-out hover:translate-x-0.5 hover:border-coral-hover-border',
  quickLinkIcon:
    'grid aspect-square w-[30px] flex-none place-items-center rounded-full bg-primary text-white',
  quickLinkIconDark: 'bg-foreground',
  quickLinkIconPlain: 'bg-transparent',
  inviteFlow:
    'mt-3.5 grid grid-cols-3 gap-0 overflow-hidden rounded-md bg-card p-[22px] shadow-card max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] max-[1100px]:gap-4 max-[820px]:min-w-0 max-[820px]:grid-cols-1 max-[820px]:gap-3.5 max-[820px]:p-4 group-data-[tab=community]/shell:gap-3.5 group-data-[tab=community]/shell:p-4 group-data-[tab=community]/shell:max-[820px]:gap-3.5',
  inviteFlowItem:
    'flex min-w-0 flex-col gap-2 px-1 max-[820px]:grid max-[820px]:grid-cols-[28px_minmax(0,1fr)] max-[820px]:gap-x-3 max-[820px]:px-0',
  inviteFlowTop: 'flex items-center gap-2.5 max-[820px]:items-start',
  inviteFlowStep:
    'grid aspect-square w-[30px] flex-none place-items-center rounded-[15px] bg-primary text-[13px] font-semibold text-white max-[820px]:w-7 max-[820px]:rounded-[14px]',
  inviteFlowLine:
    'h-0.5 flex-1 rounded-sm bg-border max-[820px]:hidden data-[tone=primary]:!bg-primary data-[tone=muted]:!bg-border',
  inviteFlowTitle:
    'm-0 text-sm font-semibold leading-[1.3] tracking-[-0.28px] text-foreground max-[820px]:col-start-2 max-[820px]:row-start-1 max-[820px]:mt-0',
  inviteFlowBody:
    'm-0 max-w-[24ch] text-xs leading-[1.5] tracking-[-0.24px] text-muted-foreground max-[820px]:col-start-2 max-[820px]:row-start-2 max-[820px]:mt-[3px] max-[820px]:max-w-none max-[820px]:leading-[1.35] group-data-[tab=community]/shell:max-[820px]:line-clamp-2 group-data-[tab=community]/shell:max-[820px]:text-[13px] group-data-[tab=community]/shell:max-[820px]:leading-[1.28]',
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
  referrerAddrRow: 'flex h-[46px] items-center justify-between rounded-[11px] bg-background px-[14px]',
} as const

const DAPP_BTN_KIND = {
  action: 'min-h-[44px] w-full whitespace-nowrap rounded-full text-[14px] leading-normal max-[820px]:min-h-[46px]',
  capsule: 'min-h-10 rounded-full px-5 text-[13px] leading-[1.3]',
  pill: 'rounded-full px-4 py-[7px] text-[13px] leading-[1.3] tracking-[-0.13px]',
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

/** shadcn 风格：禁用无 hover、灰底弱对比文字 */
export const buttonDisabledClass = cn(
  'disabled:pointer-events-none disabled:cursor-not-allowed',
  'disabled:translate-y-0 disabled:shadow-none',
  'disabled:hover:translate-y-0 disabled:hover:shadow-none',
)

const DAPP_BTN_DISABLED_TONE = {
  primary:
    'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  secondary:
    'disabled:border-border disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100',
  subtle:
    'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  light:
    'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  panel:
    'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  active: 'disabled:opacity-50',
  text: 'disabled:text-muted-foreground disabled:opacity-100',
} as const

export function dappButtonClass(
  kind: keyof typeof DAPP_BTN_KIND,
  tone: keyof typeof DAPP_BTN_TONE,
  className?: string,
) {
  return cn(
    'inline-flex cursor-pointer items-center justify-center font-semibold tracking-[0] transition-[border-color,background-color,box-shadow,transform,opacity,color] duration-[180ms] ease-out',
    buttonDisabledClass,
    DAPP_BTN_KIND[kind],
    DAPP_BTN_TONE[tone],
    DAPP_BTN_DISABLED_TONE[tone],
    SURFACE_BORDER_TONES.has(tone) && surfacePillHoverClass,
    className,
  )
}
