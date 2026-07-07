import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { DappSideCard } from '~/app/shell/components/dapp-card'
import { dappReferralAmountClass, dappSideCardSpanClass } from '~/app/dapp-type-scale'
import { cn } from '~/shared/lib/utils'

export const rewardsSideCard = tv({
  base: cn('gap-1.5 rounded-md px-4 py-3.5', dappSideCardSpanClass),
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
      <span className="text-xs font-normal leading-[1.5] tracking-[-0.24px] text-ink-strong max-dapp:text-faint">
        {label}
      </span>
      <strong className="text-right text-xs font-semibold leading-[1.3] tracking-[-0.24px] text-foreground max-dapp:leading-[1.2]">
        {value}
      </strong>
    </div>
  )
}

export const rewardsClaimAction = tv({
  base: 'mt-3 !min-h-10 max-dapp:!min-h-11 max-dapp:!text-sm max-dapp:!leading-[1.2] max-dapp:!tracking-[-0.28px]',
})

export const rewardsBalanceHeaderMeta = tv({
  base: 'max-dapp:text-faint',
})

export const rewardsBalanceHint = tv({
  base: 'max-dapp:hidden',
})

export const rewardsReferralAmount = tv({
  base: dappReferralAmountClass,
})

export function RewardsSideCard({
  children,
  className,
  layout = 'stack',
}: {
  children: ReactNode
  className?: string
  layout?: 'stack' | 'grid'
}) {
  return (
    <DappSideCard className={cn(rewardsSideCard({ layout }), className)}>
      {children}
    </DappSideCard>
  )
}
