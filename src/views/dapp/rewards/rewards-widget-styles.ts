import { tv } from 'tailwind-variants'

/** Layout-only — chrome from `DappSideCard` / Card outlined (`p-3.5` / `rounded-md`). */
export const rewardsSideCard = tv({
  base: 'gap-1.5',
  variants: {
    layout: {
      stack: '',
      grid: 'grid gap-1.5',
    },
  },
  defaultVariants: {
    layout: 'stack',
  },
})

export const rewardsProgressRow = tv({
  slots: {
    row: 'flex items-center justify-between gap-3',
  },
})

/** Spacing only — height/type from Button `sm` + `pill`. */
export const rewardsClaimAction = tv({
  base: 'mt-3',
})

export const rewardsBalanceHeaderMeta = tv({
  base: '',
})

export const rewardsBalanceHint = tv({
  base: 'text-foreground/30 max-dapp:hidden',
})

export const rewardsReferralAmount = tv({
  base: 'text-(length:--type-figure-size) leading-[1.3] tracking-[-0.03em]',
})
