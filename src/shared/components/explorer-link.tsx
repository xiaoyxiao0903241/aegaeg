import { dappAssets } from '~/shared/assets/dapp'
import { Icon } from '~/shared/components/icon'
import { Text, type TextTone } from '~/shared/components/text'
import { bscscanAddress, bscscanTx } from '~/shared/config/explorer'
import { cn } from '~/shared/lib/utils'
import { formatShortAddress } from '~/shared/presenters/format'

type ExplorerLinkKind = 'address' | 'tx'

/**
 * 链上地址 / 交易哈希：打开 BscScan；默认 primary，无下划线，hover 显示下划线。
 * Hex 用等宽，避免同一列宽窄不一。
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
  tone?: Extract<TextTone, 'primary' | 'muted-foreground'>
}) {
  const href = kind === 'tx' ? bscscanTx(value) : bscscanAddress(value)
  const label = formatShortAddress(value, shortOptions)

  return (
    <Text
      as="a"
      className={cn(
        'inline-flex items-center gap-1 font-mono no-underline hover:underline',
        className,
      )}
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
