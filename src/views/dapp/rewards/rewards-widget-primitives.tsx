import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { DappSideCard } from '~/app/components/dapp-card'
import { textVariants } from '~/shared/ui/text'
import { cn } from '~/lib/utils'

export const rewardsSideCard = tv({
  base: 'gap-1.5 rounded-md px-4 py-3.5 [&_span]:text-xs [&_span]:tracking-[-0.24px]',
  variants: {
    layout: {
      stack: '',
      grid: 'grid gap-1.5',
    },
    referral: {
      true: 'max-dapp:[&_small]:hidden',
      false: '',
    },
  },
  defaultVariants: {
    layout: 'stack',
    referral: false,
  },
})

export const rewardsRankMeta = tv({
  base: 'text-xs font-normal leading-normal tracking-[-0.24px] text-ink-strong max-dapp:text-faint',
  variants: {
    align: {
      left: '',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
})

const rewardsProgressRow = tv({
  slots: {
    row: 'flex items-center justify-between gap-3',
    label: 'text-xs font-normal leading-[1.5] tracking-[-0.24px] text-ink-strong max-dapp:text-faint',
    value:
      'text-right text-xs font-semibold leading-[1.3] tracking-[-0.24px] text-foreground max-dapp:leading-[1.2]',
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
      <span className={styles.label()}>{label}</span>
      <strong className={styles.value()}>{value}</strong>
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
  base: textVariants({ size: 'amount' }),
})

export function RewardsSideCard({
  children,
  className,
  layout = 'stack',
  referral = false,
}: {
  children: ReactNode
  className?: string
  layout?: 'stack' | 'grid'
  referral?: boolean
}) {
  return (
    <DappSideCard className={cn(rewardsSideCard({ layout, referral }), className)}>
      {children}
    </DappSideCard>
  )
}
