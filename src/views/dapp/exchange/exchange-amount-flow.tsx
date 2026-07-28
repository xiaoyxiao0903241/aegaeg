import type { InputHTMLAttributes, ReactNode } from 'react'
import { ExchangeAmountSkeleton } from '~/app/shell/dapp-skeleton'
import { TokenChip } from '~/app/shell/token-chip'
import { useI18n } from '~/i18n/use-i18n'
import { AmountBox } from '~/shared/ui/amount-box'
import { PercentButtonRow } from '~/shared/ui/segment'
import { cn } from '~/shared/lib/utils'

type AmountToken = { icon?: string; symbol: string }

export function ExchangeAmountFlow({
  amountBoxClassName,
  buy,
  buyAmount,
  buyBalance,
  buyLabel,
  middleSlot,
  onFillPercent,
  onSellAmountChange,
  onTokenPick,
  sell,
  sellAmountDisplay,
  sellBalance,
  sellLabel,
  sessionReady,
  showBuyAmountSkeleton,
  tokenPicker = false,
  walletReady,
  amountLocked = false,
}: {
  amountBoxClassName?: string
  buy: AmountToken
  buyAmount: string
  buyBalance: ReactNode
  /** Override default Sell/Buy card labels (Burn uses destroy / receive copy). */
  buyLabel?: string
  middleSlot: ReactNode
  onFillPercent: (percent: number) => void
  onSellAmountChange: (value: string) => void
  /** Trade: pill+chevron; click flips pair (USD1↔AGX). */
  onTokenPick?: () => void
  sell: AmountToken
  sellAmountDisplay: string
  sellBalance: ReactNode
  sellLabel?: string
  sessionReady: boolean
  showBuyAmountSkeleton: boolean
  tokenPicker?: boolean
  walletReady: boolean
  /** Lock sell input / percent while a tx is in flight (amount already snapshotted). */
  amountLocked?: boolean
}) {
  const { messages: t } = useI18n()
  const exchangePreview = !sessionReady
  const sellDisabled = (sessionReady && !walletReady) || amountLocked
  const pickDisabled = amountLocked || (sessionReady && !walletReady)

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
        label={sellLabel ?? t.exchange.sell}
        sessionReady={sessionReady}
        startAdornment={
          <TokenChip
            icon={sell.icon}
            label={sell.symbol}
            onClick={tokenPicker && !pickDisabled ? onTokenPick : undefined}
            picker={tokenPicker}
          />
        }
      />

      <PercentButtonRow
        aria-label={`${sell.symbol} sell percent`}
        className="pt-2.5 max-dapp:mt-3 max-dapp:py-0"
        disabled={(!exchangePreview && !walletReady) || amountLocked}
        onSelect={onFillPercent}
      />

      {middleSlot}

      <AmountBox
        amountProps={{
          'aria-label': `${buy.symbol} receive amount`,
          // Display-only: no typing, no focus chrome (Figma caret frame is Sell-side only in product).
          onMouseDown: (event) => event.preventDefault(),
          placeholder: '0.00',
          readOnly: true,
          tabIndex: -1,
          value: exchangePreview ? buyAmount || '0.00' : buyAmount,
        }}
        balance={buyBalance}
        className={cn('mt-0', amountBoxClassName)}
        label={buyLabel ?? t.exchange.buy}
        loading={showBuyAmountSkeleton}
        loadingSkeleton={<ExchangeAmountSkeleton />}
        sessionReady={sessionReady}
        startAdornment={
          <TokenChip
            icon={buy.icon}
            label={buy.symbol}
            onClick={tokenPicker && !pickDisabled ? onTokenPick : undefined}
            picker={tokenPicker}
          />
        }
      />
    </>
  )
}
