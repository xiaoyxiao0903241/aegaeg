import type { InputHTMLAttributes, ReactNode } from 'react'
import { dappCardClass, dappLayout, dappTextClass } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'
import { TokenChip } from './token-chip'

type SwapAmountBoxProps = {
  amountProps: InputHTMLAttributes<HTMLInputElement> & {
    'aria-label': string
  }
  balance: ReactNode
  className?: string
  label: ReactNode
  mobilePreviewValue?: ReactNode
  tokenIcon: string
  tokenLabel: string
}

export function SwapAmountBox({
  amountProps,
  balance,
  className,
  label,
  mobilePreviewValue,
  tokenIcon,
  tokenLabel,
}: SwapAmountBoxProps) {
  return (
    <section className={dappCardClass('swapForm', { className })}>
      <div className={dappLayout.formRow}>
        <span className={dappTextClass('formLabel', { tone: 'body' })}>{label}</span>
        <small className={dappTextClass('formHint', { tone: 'body' })}>
          <span>{balance}</span>
        </small>
      </div>
      <div className={dappLayout.tokenAmountRow}>
        <TokenChip icon={tokenIcon} label={tokenLabel} />
        <input
          className={cn(
            dappLayout.amountInput,
            mobilePreviewValue && 'max-[820px]:hidden',
          )}
          {...amountProps}
        />
        {mobilePreviewValue ? (
          <span className={dappLayout.amountMobilePreview} aria-hidden="true">
            {mobilePreviewValue}
          </span>
        ) : null}
      </div>
    </section>
  )
}
