import type { InputHTMLAttributes, ReactNode } from 'react'
import { dappCardClass, dappResponsive, dappLayout, dappTextClass } from '../../components/primitive-styles'
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
  tokenIcon,
  tokenLabel,
}: SwapAmountBoxProps) {
  const labelTone = connected ? 'body' : 'subtle'
  const disconnectedLabelClass = !connected ? 'text-xs tracking-[-0.24px]' : undefined

  return (
    <section
      className={dappCardClass('swapForm', {
        className: cn(
          dappResponsive.swapForm,
          !connected && '[&_input]:text-ink-muted [&_input]:placeholder:text-ink-muted',
          className,
        ),
      })}
    >
      <div className={dappLayout.formRow}>
        <span
          className={dappTextClass('body', {
            tone: labelTone,
            className: disconnectedLabelClass,
          })}
        >
          {label}
        </span>
        <small
          className={dappTextClass('body', {
            tone: connected ? 'ink' : 'subtle',
            className: cn(connected && 'font-semibold', disconnectedLabelClass),
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
          <input
            className={cn(
              dappLayout.amountInput,
              !connected && 'text-ink-muted placeholder:text-ink-muted',
            )}
            {...amountProps}
          />
        )}
      </div>
    </section>
  )
}
