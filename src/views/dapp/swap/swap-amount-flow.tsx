import type { InputHTMLAttributes, ReactNode } from 'react'
import { SwapAmountSkeleton } from '~/app/shell/dapp-skeleton'
import { TokenChip } from '~/app/shell/token-chip'
import { useI18n } from '~/i18n/use-i18n'
import { AmountBox } from '~/shared/ui/amount-box'
import { PercentButtonRow } from '~/shared/ui/segment'
import { cn } from '~/shared/lib/utils'

type AmountToken = { icon: string; symbol: string }

export function SwapAmountFlow({
  amountBoxClassName,
  buy,
  buyAmount,
  buyBalance,
  middleSlot,
  onFillPercent,
  onSellAmountChange,
  sell,
  sellAmountDisplay,
  sellBalance,
  sessionReady,
  showBuyAmountSkeleton,
  walletReady,
  amountLocked = false,
}: {
  amountBoxClassName?: string
  buy: AmountToken
  buyAmount: string
  buyBalance: ReactNode
  middleSlot: ReactNode
  onFillPercent: (percent: number) => void
  onSellAmountChange: (value: string) => void
  sell: AmountToken
  sellAmountDisplay: string
  sellBalance: ReactNode
  sessionReady: boolean
  showBuyAmountSkeleton: boolean
  walletReady: boolean
  /** Lock sell input / percent while a tx is in flight (amount already snapshotted). */
  amountLocked?: boolean
}) {
  const { messages: t } = useI18n()
  const swapPreview = !sessionReady
  const sellDisabled = (sessionReady && !walletReady) || amountLocked

  const sellAmountProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    'aria-label': string
  } = {
    'aria-label': `${sell.symbol} sell amount`,
    disabled: sellDisabled,
    inputMode: 'decimal',
    onChange: (event) => onSellAmountChange(event.currentTarget.value),
    placeholder: '0.00',
    value: sellAmountDisplay,
  }

  return (
    <>
      <AmountBox
        amountProps={sellAmountProps}
        balance={sellBalance}
        className={amountBoxClassName}
        label={t.swap.sell}
        sessionReady={sessionReady}
        startAdornment={<TokenChip icon={sell.icon} label={sell.symbol} />}
      />

      <PercentButtonRow
        className="pt-2.5 max-dapp:mt-3 max-dapp:py-0"
        disabled={(!swapPreview && !walletReady) || amountLocked}
        onSelect={onFillPercent}
      />

      {middleSlot}

      <AmountBox
        amountProps={{
          'aria-label': `${buy.symbol} receive amount`,
          placeholder: '0.00',
          readOnly: true,
          value: swapPreview ? buyAmount || '0.00' : buyAmount,
        }}
        balance={buyBalance}
        className={cn('mt-0', amountBoxClassName)}
        label={t.swap.buy}
        loading={showBuyAmountSkeleton}
        loadingSkeleton={<SwapAmountSkeleton />}
        sessionReady={sessionReady}
        startAdornment={<TokenChip icon={buy.icon} label={buy.symbol} />}
      />
    </>
  )
}
