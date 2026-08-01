import type { InputHTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'

/** Amount input card — label + balance / amount row + token selector + input. */
export const amountBox = tv({
  slots: {
    // Figma sell/buy cards: default border; focused editable field → coral card stroke (#c85c3f)
    root: 'flex flex-col gap-2 focus-within:border-coral',
    /**
     * Figma inputBox 4454:642: h=53 = py12 + 24px/29 linebox + py12; px14; radius16.
     * Override Card `p-3.5`; lock min-h so figure + maxB(27) stay ≤53±2.
     */
    rootOutside: 'min-h-[53px] gap-0 rounded-md p-0 px-3.5 py-3 focus-within:border-coral',
    header: 'flex items-center justify-between gap-3',
    label: '',
    balance: 'text-right',
    body: 'flex items-center justify-between gap-3 max-dapp:items-start',
    /** Exchange: amount right. Staking headerOutside: amount left (Figma 4454:642). */
    input: 'ml-auto max-w-[65%]',
    inputOutside:
      'mr-auto max-w-[50%] text-left text-[24px] leading-[29px] text-foreground placeholder:text-foreground/40',
  },
})

export type AmountBoxProps = {
  amountProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { 'aria-label': string }
  balance?: ReactNode
  className?: string
  disabled?: boolean
  endAdornment?: ReactNode
  /**
   * When true, label/balance sit above the bordered input (stake/bond/xmine/calc).
   * When false (default), label/balance are inside the card (exchange sell/buy).
   */
  headerOutside?: boolean
  inputClassName?: string
  label: ReactNode
  /** Kept for call-site compatibility; no longer forces balance semibold. */
  sessionReady?: boolean
  startAdornment: ReactNode
}

function renderMetricText(node: ReactNode) {
  return typeof node === 'string' ? <DappCountValue text={node} /> : node
}

export function AmountBox({
  amountProps,
  balance,
  className,
  disabled = false,
  endAdornment,
  headerOutside = false,
  inputClassName,
  label,
  sessionReady = true,
  startAdornment,
}: AmountBoxProps) {
  const styles = amountBox()

  const header = (
    <div className={styles.header()}>
      <Text
        as="span"
        variant="copy"
        className={cn(
          styles.label(),
          headerOutside ? 'text-foreground/40' : 'text-[13px] font-normal text-foreground/70',
        )}
      >
        {renderMetricText(label)}
      </Text>
      {balance ? (
        typeof balance === 'string' ? (
          <Text
            as="span"
            variant="copy"
            className={cn(
              styles.balance(),
              headerOutside ? 'text-foreground/40' : 'text-[13px] font-normal text-foreground/70',
            )}
          >
            {renderMetricText(balance)}
          </Text>
        ) : (
          <span className={styles.balance()}>{balance}</span>
        )
      ) : null}
    </div>
  )

  const body = (
    <div className={styles.body()}>
      {startAdornment}
      <Input
        variant="amount"
        disabled={disabled}
        className={cn(
          headerOutside ? styles.inputOutside() : styles.input(),
          !sessionReady && 'text-amount-muted placeholder:text-amount-muted',
          inputClassName,
        )}
        {...amountProps}
      />
      {endAdornment}
    </div>
  )

  if (headerOutside) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {header}
        <Card as="section" surface="outlined" className={styles.rootOutside()}>
          {body}
        </Card>
      </div>
    )
  }

  return (
    <Card as="section" surface="outlined" className={cn(styles.root(), className)}>
      {header}
      {body}
    </Card>
  )
}
