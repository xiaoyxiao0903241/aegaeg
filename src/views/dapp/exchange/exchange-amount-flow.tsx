import type { InputHTMLAttributes, ReactNode } from 'react'

import { TokenChip } from '~/app/shell/token-chip'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/shared/lib/utils'
import { AmountBox } from '~/shared/ui/amount-box'
import { PercentButtonRow } from '~/views/dapp/exchange/percent-button-row'

type AmountToken = { icon?: string; symbol: string }

export function ExchangeAmountFlow({
  amountBoxClassName,
  buy,
  buyAmount,
  buyBalance,
  buyLabel,
  buyTokenAdornment,
  middleSlot,
  onFillPercent,
  onSellAmountChange,
  sell,
  sellAmountDisplay,
  sellBalance,
  sellLabel,
  sellTokenAdornment,
  sessionReady,
  walletReady,
  amountLocked = false,
}: {
  amountBoxClassName?: string
  buy: AmountToken
  buyAmount: string
  buyBalance: ReactNode
  /** Override default Sell/Buy card labels (Burn uses destroy / receive copy). */
  buyLabel?: string
  /** Trade: real token picker (chevron + open list). Flash/Burn omit → static chip. */
  buyTokenAdornment?: ReactNode
  middleSlot: ReactNode
  onFillPercent: (percent: number) => void
  onSellAmountChange: (value: string) => void
  sell: AmountToken
  sellAmountDisplay: string
  sellBalance: ReactNode
  sellLabel?: string
  sellTokenAdornment?: ReactNode
  sessionReady: boolean
  walletReady: boolean
  /** Lock sell input / percent while a tx is in flight (amount already snapshotted). */
  amountLocked?: boolean
}) {
  const { messages: t } = useI18n()
  const exchangePreview = !sessionReady
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
        className={cn('p-4', amountBoxClassName)}
        label={sellLabel ?? t.exchange.sell}
        sessionReady={sessionReady}
        startAdornment={sellTokenAdornment ?? <TokenChip icon={sell.icon} label={sell.symbol} />}
      />

      <PercentButtonRow
        aria-label={`${sell.symbol} sell percent`}
        className="pt-1.5 max-dapp:mt-3 max-dapp:py-0"
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
          value: exchangePreview ? buyAmount || '0.00' : buyAmount || '0.00',
        }}
        balance={buyBalance}
        className={cn('mt-0 p-4', amountBoxClassName)}
        label={buyLabel ?? t.exchange.buy}
        sessionReady={sessionReady}
        startAdornment={buyTokenAdornment ?? <TokenChip icon={buy.icon} label={buy.symbol} />}
      />
    </>
  )
}
