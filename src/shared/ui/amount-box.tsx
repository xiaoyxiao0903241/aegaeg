import type { InputHTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Card } from '~/shared/ui/card'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/** Amount input card — label + balance / amount row + token selector + input. */
export const amountBox = tv({
  slots: {
    // Figma sell/buy cards: default border; focused editable field → coral card stroke (#c85c3f)
    root: 'flex flex-col gap-2 focus-within:border-coral',
    header: 'flex items-center justify-between gap-3',
    label: '',
    balance: 'text-right',
    body: 'flex items-center justify-between gap-3 max-dapp:items-start',
    input: 'ml-auto max-w-[65%]',
  },
})

export type AmountBoxProps = {
  amountProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { 'aria-label': string }
  balance?: ReactNode
  className?: string
  disabled?: boolean
  endAdornment?: ReactNode
  inputClassName?: string
  label: ReactNode
  /** Balance uses semibold only when logged in. */
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
  inputClassName,
  label,
  sessionReady = true,
  startAdornment,
}: AmountBoxProps) {
  const styles = amountBox()
  const labelTone = 'muted-foreground' as const

  return (
    <Card as="section" surface="outlined" className={cn(styles.root(), className)}>
      <div className={styles.header()}>
        <Text as="span" variant="support" tone={labelTone} className={styles.label()}>
          {renderMetricText(label)}
        </Text>
        {balance ? (
          <Text
            as="span"
            variant="support"
            tone="muted-foreground"
            className={cn(styles.balance(), sessionReady && !disabled && 'font-semibold')}
          >
            {renderMetricText(balance)}
          </Text>
        ) : null}
      </div>
      <div className={styles.body()}>
        {startAdornment}
        <Input
          variant="amount"
          disabled={disabled}
          className={cn(
            styles.input(),
            !sessionReady && 'text-amount-muted placeholder:text-amount-muted',
            inputClassName,
          )}
          {...amountProps}
        />
        {endAdornment}
      </div>
    </Card>
  )
}
