import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Text } from '~/shared/ui/text'

export const rewardsSideCard = tv({
  base: 'gap-1.5 rounded-md px-4 py-3.5',
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
      <Text variant="copy" tone="muted-foreground" className="text-xs">
        {label}
      </Text>
      <Text as="strong" variant="copy" tone="foreground" className="text-right text-xs">
        {value}
      </Text>
    </div>
  )
}

export const rewardsClaimAction = tv({
  base: 'mt-3 !min-h-10 max-dapp:!min-h-11 max-dapp:!text-sm max-dapp:!leading-[1.2] max-dapp:!tracking-[-0.28px]',
})

export const rewardsBalanceHeaderMeta = tv({
  base: 'tracking-[-0.24px]',
})

/** 4175 `tone="muted"` = faint 30%；Foundation 无 faint → foreground/30 */
export const rewardsBalanceHint = tv({
  base: 'max-dapp:hidden text-foreground/30',
})

/** Referral amount: 4175 used amount token + leading 1.3 / tracking -0.54 (overrides Card.Value text-lg default). */
export const rewardsReferralAmount = tv({
  base: 'text-[length:var(--dapp-type-amount-size)] leading-[1.3] tracking-[-0.54px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]',
})
