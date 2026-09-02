import { dappAssets } from '~/shared/assets/dapp'
import { Icon } from '~/shared/components/icon'
import { Text, type TextTone } from '~/shared/components/text'
import { bscscanAddress, bscscanTx } from '~/shared/config/explorer'
import { cn } from '~/shared/lib/utils'
import { formatShortAddress } from '~/shared/presenters/format'

type ExplorerLinkKind = 'address' | 'tx'

/**
 * 链上地址 / 交易哈希：打开 BscScan。
 * 默认 primary；表内链接由 Table 着蓝，与珊瑚数字错开。
 */
export function ExplorerLink({
  value,
  kind = 'address',
  showIcon = false,
  className,
  shortOptions,
  tone = 'primary',
}: {
  value: string
  kind?: ExplorerLinkKind
  /** 为 true 时在链接文本后显示外链图标 */
  showIcon?: boolean
  className?: string
  shortOptions?: { head?: number; tail?: number }
  tone?: Extract<TextTone, 'claim' | 'primary' | 'muted-foreground'>
}) {
  const href = kind === 'tx' ? bscscanTx(value) : bscscanAddress(value)
  const label = formatShortAddress(value, shortOptions)

  return (
    <Text
      as="a"
      className={cn('inline-flex items-center gap-1 underline', className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      tone={tone}
      variant="copy"
    >
      {label}
      {showIcon ? (
        <Icon alt="" className="size-2.5 shrink-0" size="sm" src={dappAssets.arrowUpRight} />
      ) : null}
    </Text>
  )
}
