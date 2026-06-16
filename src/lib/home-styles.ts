import { surfacePillHoverClass } from '~/lib/chip-styles'
import { cn } from '~/lib/utils'

export const homeShellClass = 'min-h-screen overflow-x-clip'

export const homeContainerClass = 'mx-auto w-[min(calc(100%-48px),var(--container))]'

export const homeNavClass = cn(
  'fixed inset-x-0 top-0 z-50 flex h-[74px] w-full items-center border-b border-[oklch(94.87%_0.0058_264.53_/_72%)] bg-[oklch(97.29%_0.0029_264.54_/_88%)] backdrop-blur-[18px]',
  'max-[820px]:min-h-[60px] max-[820px]:bg-background max-[820px]:py-0 max-[820px]:backdrop-blur-none',
)

export const homeNavInnerClass = cn(
  'flex h-[74px] w-full items-center justify-between gap-6',
  'max-[820px]:min-h-[60px] max-[820px]:flex-nowrap max-[820px]:gap-3 max-[820px]:px-5',
)

export const homeBrandClass = cn(
  'inline-flex items-center gap-[11px] whitespace-nowrap text-lg font-semibold tracking-normal text-foreground',
  'max-[820px]:gap-[9px] max-[820px]:text-base max-[820px]:leading-[1.2]',
)

export const homeBrandMarkClass = cn(
  'h-[27px] w-7 object-contain',
  'max-[820px]:h-[22px] max-[820px]:w-6',
)

export const homeBrandInverseClass = 'text-primary-foreground'

export const homeNavLinksClass = cn(
  'flex items-center gap-[34px] whitespace-nowrap text-[15px] font-medium text-ink-strong',
  'max-[1100px]:hidden',
  '[&_a]:transition-[color,transform] [&_a]:duration-180 [&_a]:ease-out',
  '[&_a:hover]:-translate-y-px [&_a:hover]:text-foreground',
)

export const homeNavActionsClass = cn(
  'flex items-center gap-3.5',
  'max-[820px]:w-auto max-[820px]:justify-end max-[820px]:gap-2.5',
)

const HOME_BTN_BASE = cn(
  'inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full px-[26px]',
  'text-[15px] font-semibold leading-none tracking-normal whitespace-nowrap',
  'transition-[box-shadow,border-color,background-color,opacity,color,transform] duration-180 ease-out',
  'hover:opacity-[0.96] focus-visible:opacity-[0.96]',
)

const HOME_BTN_VARIANT = {
  primary: cn(
    'border-0 bg-primary text-primary-foreground',
    'visited:text-primary-foreground hover:text-primary-foreground focus-visible:text-primary-foreground',
    'hover:opacity-100 focus-visible:opacity-100',
    'hover:-translate-y-px hover:shadow-primary-hover focus-visible:-translate-y-px focus-visible:shadow-primary-hover',
  ),
  secondary: cn(
    'border border-border bg-card text-foreground',
    'visited:text-foreground hover:text-foreground focus-visible:text-foreground',
    surfacePillHoverClass,
    'hover:shadow-card focus-visible:shadow-card',
  ),
  ghost: cn(
    'border border-border bg-transparent text-foreground',
    'visited:text-foreground hover:text-foreground focus-visible:text-foreground',
    surfacePillHoverClass,
    'hover:shadow-card focus-visible:shadow-card',
  ),
} as const

export function homeBtnClass(
  variant: keyof typeof HOME_BTN_VARIANT,
  opts?: { sm?: boolean; className?: string },
) {
  return cn(
    HOME_BTN_BASE,
    opts?.sm && 'min-h-[39px] px-[18px] text-sm',
    HOME_BTN_VARIANT[variant],
    opts?.className,
  )
}

export const deferredImgClass =
  '[[&:not([src])]]:bg-[linear-gradient(135deg,var(--card),var(--secondary))]'

export const homeHeroRaysClass = cn(
  'pointer-events-none absolute left-[calc(50%-358px)] top-[-477px] aspect-square w-[1500px] opacity-[0.72]',
  '[animation:hero-rays-drift_48s_linear_infinite]',
  '[background:repeating-conic-gradient(from_0deg,oklch(40%_0.02_260_/_13%)_0deg_0.28deg,transparent_0.28deg_4.8deg)]',
  '[mask-image:radial-gradient(circle,black_0%,oklch(0%_0_0_/_65%)_35%,transparent_62%)]',
  'max-[820px]:hidden',
)

export const homeArtGlowClass = cn(
  'pointer-events-none absolute -top-px left-[-7px] aspect-square w-[142%] max-w-[620px] rounded-full opacity-[0.28] blur-[10px]',
  '[background:radial-gradient(circle,oklch(94%_0.035_45_/_42%),transparent_58%)]',
  'max-[1100px]:left-1/2 max-[1100px]:-translate-x-1/2',
  'max-[820px]:hidden',
)

export const homeMetricsRaysClass = cn(
  'pointer-events-none absolute inset-0 z-0 opacity-[0.82]',
  '[background:radial-gradient(280px_110px_at_50%_-2%,oklch(100%_0_0_/_16%),transparent_72%),repeating-conic-gradient(from_-90deg_at_50%_-12%,oklch(100%_0_0_/_10%)_0deg_0.28deg,transparent_0.28deg_2.4deg)]',
  '[mask-image:radial-gradient(ellipse_88%_160%_at_50%_0%,black_0%,black_54%,rgb(0_0_0_/_76%)_76%,transparent_100%)]',
  'max-[820px]:hidden',
)

export const homeMetricsPanelGlowClass = cn(
  "after:pointer-events-none after:absolute after:top-[-26px] after:left-1/2 after:z-0 after:h-[62px] after:w-[62px] after:-translate-x-1/2 after:rounded-full after:bg-white/56 after:blur-[18px] after:content-['']",
  'max-[820px]:after:hidden',
)

export const homeFooterBrandClass = cn(
  homeBrandClass,
  'tracking-[-0.36px] leading-none [&_img]:h-[26px]',
)

export const tokenCardHoverClass = cn(
  'max-[820px]:hover:shadow-none',
  'hover:shadow-[0_20px_56px_oklch(22%_0.04_265_/_18%)] hover:saturate-[1.02]',
  'hover:before:opacity-100',
  'hover:[&_.token-tile]:border-white/50 hover:[&_.token-tile]:bg-white/20 hover:[&_.token-tile]:shadow-[0_10px_26px_oklch(0%_0_0_/_12%)]',
  'hover:[&_.token-tile_img]:saturate-[1.08] hover:[&_.token-tile_img]:contrast-[1.04]',
  'hover:[&_.token-shape-wrap]:opacity-100 hover:[&_.token-shape-wrap]:saturate-[1.08]',
)

const HOME_CARD_RADIUS = {
  sm: 'rounded-[14px]',
  md: 'rounded-md',
  lg: 'rounded-[18px]',
  xl: 'rounded-lg',
  full: 'rounded-full',
  none: 'rounded-none',
} as const

const HOME_CARD_TONE = {
  surface: 'bg-card shadow-card',
  dark: 'bg-dark text-white',
  transparent: '',
  token: 'text-white shadow-token',
} as const

const HOME_CARD_BORDER = {
  none: '',
  all: 'border border-border',
  desktopLeft: 'min-[821px]:border-l min-[821px]:border-border',
  desktopTop: 'min-[821px]:border-t min-[821px]:border-border',
} as const

export function homeCardClass(opts: {
  radius?: keyof typeof HOME_CARD_RADIUS
  tone?: keyof typeof HOME_CARD_TONE
  border?: keyof typeof HOME_CARD_BORDER
  interactive?: boolean
  hover?: 'none' | 'shadow'
  className?: string
}) {
  const {
    radius = 'md',
    tone = 'surface',
    border = 'none',
    interactive = false,
    hover = 'none',
    className,
  } = opts

  return cn(
    HOME_CARD_RADIUS[radius],
    HOME_CARD_TONE[tone],
    HOME_CARD_BORDER[border],
    interactive &&
      'transition-[transform,box-shadow] duration-[220ms] ease-out hover:-translate-y-1 hover:shadow-card-strong',
    hover === 'shadow' &&
      'transition-shadow duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:shadow-[0_14px_34px_oklch(22%_0.04_265_/_10%)] focus-within:shadow-[0_14px_34px_oklch(22%_0.04_265_/_10%)]',
    className,
  )
}

const HOME_TEXT = {
  eyebrow:
    'm-0 text-[13px] font-semibold leading-[1.25] tracking-[1.82px] max-[820px]:text-xs max-[820px]:tracking-[1.68px]',
  sectionTitle:
    'mx-auto mt-3.5 max-w-[760px] text-[40px] font-semibold leading-[1.15] max-[820px]:mt-2.5 max-[820px]:text-[26px] max-[820px]:leading-[1.2]',
  sectionSubtitle:
    'mx-auto mt-3.5 block max-w-[680px] text-[17px] leading-[1.5] max-[820px]:mt-2.5 max-[820px]:max-w-[362px] max-[820px]:text-sm',
  cardTitle:
    'mt-3 text-xl font-semibold leading-[1.2] max-[820px]:mt-2.5 max-[820px]:text-[19px]',
  cardBody:
    'mt-3 max-w-[420px] text-[15px] leading-[1.5] max-[820px]:mt-2.5 max-[820px]:w-full max-[820px]:max-w-[318px] max-[820px]:text-sm',
  tokenSymbol:
    'm-0 text-[26px] font-semibold leading-[1.3] tracking-[-0.78px] max-[820px]:mt-0.5 max-[820px]:text-[22px] max-[820px]:leading-[1.2] max-[820px]:tracking-[-0.66px]',
  tokenLabel:
    'text-sm font-semibold leading-[1.3] tracking-[-0.28px] max-[820px]:leading-[1.2]',
  tokenBody:
    'w-[min(100%,235px)] text-[13px] font-normal leading-[1.5] tracking-[-0.26px] max-[820px]:w-full',
  faqQuestion: 'text-[15px] font-semibold leading-[1.3] max-[820px]:text-sm',
  faqAnswer: 'mt-3 mb-0 text-sm leading-[1.5] max-[820px]:text-[13px]',
  footerLink: 'text-sm leading-[1.2] max-[820px]:text-[13px] max-[820px]:leading-[1.5]',
  footerHeading:
    'm-0 text-sm font-semibold leading-[1.2] tracking-[0.56px] max-[820px]:text-[13px] max-[820px]:leading-[1.5]',
} as const

const HOME_TEXT_TONE = {
  default: 'text-foreground',
  body: 'text-ink-strong',
  muted: 'text-faint',
  coral: 'text-primary',
  inverse: 'text-white',
  onDark: 'text-on-dark',
  faq: 'text-faq-text',
} as const

export function homeTextClass(
  variant: keyof typeof HOME_TEXT,
  opts?: { tone?: keyof typeof HOME_TEXT_TONE; className?: string },
) {
  return cn(
    HOME_TEXT[variant],
    HOME_TEXT_TONE[opts?.tone ?? 'default'],
    opts?.className,
  )
}
