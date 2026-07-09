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
      {/* 4175: label font-normal leading 1.5 / tracking -0.24; value font-semibold leading 1.3 */}
      <Text
        variant="copy"
        tone="muted-foreground"
        className="text-xs"
      >
        {label}
      </Text>
      <Text
        as="strong"
        variant="copy"
        tone="foreground"
        className="text-right text-xs font-semibold leading-[1.3] max-dapp:leading-[1.2]"
      >
        {value}
      </Text>
    </div>
  )
}

/** sm+pill already w-full via Button SSOT; lock min-h to 4175 40px (sm default 36). */
export const rewardsClaimAction = tv({
  base: 'mt-3 !min-h-10 max-dapp:!min-h-11 max-dapp:!text-sm max-dapp:!leading-[1.2] max-dapp:!',
})

export const rewardsBalanceHeaderMeta = tv({
  base: '',
})

/** 4175 `tone="muted"` = faint 30%；Foundation 无 faint → foreground/30 */
export const rewardsBalanceHint = tv({
  base: 'max-dapp:hidden text-foreground/30',
})

/** Referral amount: 4175 amount token + leading 1.3 / tracking -0.54；H5 保持 figure（禁吃 Card.Value 的 max-dapp:text-xs）。 */
export const rewardsReferralAmount = tv({
  base: 'text-[length:var(--type-figure-size)] leading-[1.3] tracking-[-0.54px] max-dapp:text-[length:var(--type-figure-size)] max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]',
})
