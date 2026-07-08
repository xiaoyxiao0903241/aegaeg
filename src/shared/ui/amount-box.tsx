import type { InputHTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/**
 * Composite：Figma `box` 层 — 金额输入卡。
 *
 * 结构：label + balance / amount row + token selector + input。
 * 内部用 Card surface="outlined" + Input variant="amount" + Text。
 */
export const amountBox = tv({
  slots: {
    root: 'flex flex-col gap-2',
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
  loading?: boolean
  loadingSkeleton?: ReactNode
  startAdornment: ReactNode
}

export function AmountBox({
  amountProps,
  balance,
  className,
  disabled = false,
  endAdornment,
  inputClassName,
  label,
  loading = false,
  loadingSkeleton,
  startAdornment,
}: AmountBoxProps) {
  const styles = amountBox()
  const labelTone = 'muted-foreground' as const

  return (
    <Card as="section" surface="outlined" className={cn(styles.root(), className)}>
      <div className={styles.header()}>
        <Text as="span" variant="copy" tone={labelTone} className={cn(styles.label(), 'leading-normal')}>
          {label}
        </Text>
        {balance ? (
          // 4175: text-ink-strong ≡ muted-foreground 70% (not full foreground)
          <Text
            as="span"
            variant="copy"
            tone="muted-foreground"
            className={cn(styles.balance(), 'leading-normal', !disabled && 'font-semibold')}
          >
            {balance}
          </Text>
        ) : null}
      </div>
      <div className={styles.body()}>
        {startAdornment}
        {loading ? (
          loadingSkeleton
        ) : (
          <Input
            variant="amount"
            disabled={disabled}
            className={cn(styles.input(), inputClassName)}
            {...amountProps}
          />
        )}
        {endAdornment}
      </div>
    </Card>
  )
}
