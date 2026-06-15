import type { InputHTMLAttributes, ReactNode } from 'react'
import { dappCardClass, dappLayout, dappTextClass } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'
import { SwapAmountSkeleton } from './dapp-skeleton'
import { TokenChip } from './token-chip'

type SwapAmountBoxProps = {
  amountLoading?: boolean
  amountProps: InputHTMLAttributes<HTMLInputElement> & {
    'aria-label': string
  }
  balance: ReactNode
  className?: string
  connected?: boolean
  label: ReactNode
  mobilePreviewValue?: ReactNode
  tokenIcon: string
  tokenLabel: string
}

export function SwapAmountBox({
  amountLoading = false,
  amountProps,
  balance,
  className,
  connected = true,
  label,
  mobilePreviewValue,
  tokenIcon,
  tokenLabel,
}: SwapAmountBoxProps) {
  const labelTone = connected ? 'body' : 'subtle'

  return (
    <section
      className={dappCardClass('swapForm', {
        className: cn(
          connected ? 'rounded-2xl' : 'rounded-[14px]',
          !connected && '[&_input]:text-ink-muted [&_input]:placeholder:text-ink-muted',
          className,
        ),
      })}
    >
      <div className={dappLayout.formRow}>
        <span
          className={dappTextClass('formLabel', {
            tone: labelTone,
            className: !connected && 'text-xs tracking-[-0.24px]',
          })}
        >
          {label}
        </span>
        <small
          className={dappTextClass('formHint', {
            tone: connected ? 'ink' : 'subtle',
            className: cn(
              connected && 'font-semibold',
              !connected && 'text-xs tracking-[-0.24px]',
            ),
          })}
        >
          <span>{balance}</span>
        </small>
      </div>
      <div className={dappLayout.tokenAmountRow}>
        <TokenChip icon={tokenIcon} label={tokenLabel} />
        {amountLoading ? (
          <SwapAmountSkeleton />
        ) : (
          <>
            <input
              className={cn(
                dappLayout.amountInput,
                !connected && 'text-ink-muted placeholder:text-ink-muted',
                mobilePreviewValue && 'max-[820px]:hidden',
              )}
              {...amountProps}
            />
            {mobilePreviewValue ? (
              <span
                className={cn(
                  dappLayout.amountMobilePreview,
                  !connected && 'text-ink-muted',
                )}
                aria-hidden="true"
              >
                {mobilePreviewValue}
              </span>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
