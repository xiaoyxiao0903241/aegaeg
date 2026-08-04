import type { InputHTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Input } from '~/shared/components/input'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/** Amount input card — label + balance / amount row + token selector + input. */
export const amountBox = tv({
  slots: {
    // Figma sell/buy：p-4（16）+ label copy/leading-4；focused → coral stroke
    root: 'flex flex-col gap-2 p-4 focus-within:border-coral',
    /**
     * Figma inputBox 4454:642 / amtBox 4462:620 / priceBox 4462:628：
     * 合成壳高 = py-3（--space-5）+ figure 字盒（--type-figure-*）+ border；禁任意 h-[Npx]。
     * Override Card outlined 默认 p-4 → p-0 + px-3.5 py-3。
     */
    rootOutside: 'flex items-center gap-0 rounded-md p-0 px-3.5 py-3 focus-within:border-coral',
    header: 'flex items-center justify-between gap-3',
    label: '',
    balance: 'text-right',
    body: 'flex items-center justify-between gap-3 max-dapp:items-start',
    /** Exchange: amount right. Staking headerOutside: amount left. */
    input: 'ml-auto max-w-[65%]',
    /** 字阶走 Input amount → --type-figure-*；p-0 去掉 UA pad，避免壳高被撑破 */
    inputOutside:
      'mr-auto max-w-[50%] p-0 text-left text-foreground placeholder:text-foreground/40',
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
  return typeof node === 'string' ? <CountValue text={node} /> : node
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
          headerOutside ? 'text-foreground/40' : 'leading-4 font-normal text-foreground/70',
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
              headerOutside ? 'text-foreground/40' : 'leading-4 font-normal text-foreground/70',
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
