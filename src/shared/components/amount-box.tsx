import type { InputHTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Input } from '~/shared/components/input'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 数量输入卡片
 *
 * 由标签 / 余额行、数量输入框、前后缀（代币选择等）组成。
 * `headerOutside` 决定标签与余额放在带边框输入框上方还是卡片内。
 *
 * @param amountProps 传给输入框的原生属性，需含 `aria-label`
 * @param label 标签文案（字符串会走数字滚动）
 * @param balance 余额展示（字符串会走数字滚动）
 * @param headerOutside 标签/余额移到输入框上方；默认在卡片内
 */
export const amountBox = tv({
  slots: {
    // 标签在卡片内：聚焦珊瑚描边
    root: 'flex flex-col gap-2 p-4 focus-within:border-coral',
    /** 高度由内边距、字号与边框合成，勿写死固定高度 */
    rootOutside: 'flex items-center gap-0 rounded-md p-0 px-3.5 py-3 focus-within:border-coral',
    header: 'flex items-center justify-between gap-3',
    label: '',
    balance: 'text-right',
    body: 'flex items-center justify-between gap-3 max-dapp:items-start',
    /** 兑换页数量右对齐；质押页标签在外时数量左对齐 */
    input: 'ml-auto max-w-[65%]',
    /** 去掉浏览器默认内边距，避免撑高输入框 */
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
   * 为 true 时标签/余额在带边框输入框上方（质押、债券等）；
   * 为 false（默认）时在卡片内（兑换买卖）。
   */
  headerOutside?: boolean
  inputClassName?: string
  label: ReactNode
  /** 仅为兼容旧调用保留；不再强制余额加粗 */
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
