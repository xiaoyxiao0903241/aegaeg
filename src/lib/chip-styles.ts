import { cn } from '~/lib/utils'

/** 白/卡片/玻璃底胶囊按钮的 hover 描边 —— 不用 focus-border（过深） */
export const surfacePillHoverClass = cn(
  'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
)

export const langSwitcherClass = 'relative z-40 inline-flex [[open]_&]:z-[120] [.is-open_&]:z-[120]'

export const langMenuClass = cn(
  'hidden [[open]_&]:grid [.is-open_&]:grid',
  '[[open]_&]:animate-[language-menu-in_180ms_ease_both] [.is-open_&]:animate-[language-menu-in_180ms_ease_both]',
)

/** Home / DApp 共用语言切换触发器 */
export const langTriggerClass = cn(
  'inline-flex min-h-9 min-w-[58px] cursor-pointer items-center justify-center gap-1.5 rounded-[18px]',
  'border border-border bg-card px-3 text-[13px] font-semibold leading-none text-foreground shadow-none',
  'transition-[background-color,border-color,box-shadow,transform] duration-180 ease-out',
  surfacePillHoverClass,
  'hover:-translate-y-px hover:bg-[oklch(97%_0.014_45)] hover:shadow-card',
  'focus-visible:-translate-y-px focus-visible:bg-[oklch(97%_0.014_45)] focus-visible:shadow-card',
  '[[open]_&]:border-coral-hover-border [[open]_&]:bg-[oklch(97%_0.014_45)] [[open]_&]:shadow-card',
  '[.is-open_&]:border-coral-hover-border [.is-open_&]:bg-[oklch(97%_0.014_45)] [.is-open_&]:shadow-card',
  '[&::-webkit-details-marker]:hidden [&_img]:size-4',
  'max-[820px]:min-h-[30px] max-[820px]:min-w-[58px] max-[820px]:gap-1.5 max-[820px]:px-2.5 max-[820px]:text-[11px]',
)
