import type { InputHTMLAttributes, ReactNode } from 'react'
import { AmountInput } from '~/shared/ui/amount-input'
import { Card } from '~/shared/ui/card'
import { textVariants } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'
import { SwapAmountSkeleton } from '~/app/components/dapp-skeleton'
import { TokenChip } from '~/app/components/token-chip'

type SwapAmountBoxProps = {
  amountLoading?: boolean
  amountProps: InputHTMLAttributes<HTMLInputElement> & {
    'aria-label': string
  }
  balance: ReactNode
  className?: string
  sessionReady?: boolean
  label: ReactNode
  tokenIcon: string
  tokenLabel: string
}

export function SwapAmountBox({
  amountLoading = false,
  amountProps,
  balance,
  className,
  sessionReady = true,
  label,
  tokenIcon,
  tokenLabel,
}: SwapAmountBoxProps) {
  const headerLabelClass = cn(
    textVariants({ size: 'caption' }),
    'leading-normal',
    sessionReady ? 'font-normal text-ink-strong max-dapp:text-faint' : 'text-xs tracking-[-0.24px]',
  )
  const balanceClass = cn(
    headerLabelClass,
    sessionReady && 'font-semibold text-ink-strong',
  )

  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(
        'flex flex-col gap-2 rounded-md p-3.5',
        !sessionReady && '[&_input]:text-[#c9cfda] [&_input]:placeholder:text-[#c9cfda]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={headerLabelClass}>{label}</span>
        <span className={balanceClass}>
          {balance}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 max-dapp:items-start">
        <TokenChip icon={tokenIcon} label={tokenLabel} />
        {amountLoading ? (
          <SwapAmountSkeleton />
        ) : (
          <AmountInput
            className={cn(
              sessionReady && textVariants({ size: 'amount' }),
              !sessionReady && 'text-[#c9cfda] placeholder:text-[#c9cfda]',
            )}
            {...amountProps}
          />
        )}
      </div>
    </Card>
  )
}
