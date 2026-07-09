import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Text } from '~/shared/ui/text'

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

const rewardsProgressRow = tv({
  slots: {
    row: 'flex items-center justify-between gap-3',
  },
})

export function RewardsProgressRow({
  label,
  value,
}: {
  label: ReactNode
  value: ReactNode
}) {
  const styles = rewardsProgressRow()
  return (
    <div className={styles.row()}>
      <Text variant="copy" tone="muted-foreground">
        {label}
      </Text>
      <Text
        as="strong"
        variant="copy"
        tone="foreground"
        className="text-right font-semibold"
      >
        {value}
      </Text>
    </div>
  )
}

/** Spacing only — height/type from Button `sm` + `pill`. */
export const rewardsClaimAction = tv({
  base: 'mt-3',
})

export const rewardsBalanceHeaderMeta = tv({
  base: '',
})

export const rewardsBalanceHint = tv({
  base: 'max-dapp:hidden text-foreground/30',
})

export const rewardsReferralAmount = tv({
  base: 'text-(length:--type-figure-size) leading-[1.3] tracking-[-0.03em]',
})
