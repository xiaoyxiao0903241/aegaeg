import type { InputHTMLAttributes, ReactNode } from 'react'
import { AmountInput } from '~/shared/ui/amount-input'
import { Card } from '~/shared/ui/card'
import { Text, textVariants } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'
import { SwapAmountSkeleton } from '~/app/shell/components/dapp-skeleton'
import { TokenChip } from '~/app/shell/components/token-chip'

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
  const labelTone = sessionReady ? 'foreground' : 'muted-foreground'

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
        <Text as="span" variant="copy" tone={labelTone}>
          {label}
        </Text>
        <Text
          as="span"
          variant={sessionReady ? 'figure' : 'copy'}
          tone={labelTone}
        >
          {balance}
        </Text>
      </div>
      <div className="flex items-center justify-between gap-3 max-dapp:items-start">
        <TokenChip icon={tokenIcon} label={tokenLabel} />
        {amountLoading ? (
          <SwapAmountSkeleton />
        ) : (
          <AmountInput
            className={cn(
              sessionReady && textVariants({ variant: 'figure' }),
              !sessionReady && 'text-[#c9cfda] placeholder:text-[#c9cfda]',
            )}
            {...amountProps}
          />
        )}
      </div>
    </Card>
  )
}
