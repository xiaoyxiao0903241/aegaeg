import type { InputHTMLAttributes, ReactNode } from 'react'
import { AmountInput } from '~/components/amount-input'
import { Card } from '~/components/card'
import { Text } from '~/components/text'
import { cn } from '~/lib/utils'
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
  const labelTone = sessionReady ? 'body' : 'subtle'
  const disconnectedLabelClass = !sessionReady ? 'text-xs tracking-[-0.24px]' : undefined

  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(
        'mt-3.5 p-[14px]',
        'max-dapp:mt-3',
        !sessionReady && '[&_input]:text-[#c9cfda] [&_input]:placeholder:text-[#c9cfda]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Text
          as="span"
          size="sm"
          tone={labelTone}
          className={disconnectedLabelClass}
        >
          {label}
        </Text>
        <Text
          as="small"
          size="sm"
          tone={sessionReady ? undefined : 'subtle'}
          weight={sessionReady ? 'semibold' : undefined}
          className={disconnectedLabelClass}
        >
          <span>{balance}</span>
        </Text>
      </div>
      <div className="mt-[9px] flex items-center justify-between gap-3 max-dapp:items-start">
        <TokenChip icon={tokenIcon} label={tokenLabel} />
        {amountLoading ? (
          <SwapAmountSkeleton />
        ) : (
          <AmountInput
            className={!sessionReady ? 'text-[#c9cfda] placeholder:text-[#c9cfda]' : undefined}
            {...amountProps}
          />
        )}
      </div>
    </Card>
  )
}
