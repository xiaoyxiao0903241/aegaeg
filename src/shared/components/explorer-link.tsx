import { dappAssets } from '~/shared/assets/dapp'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { bscscanAddress, bscscanTx } from '~/shared/config/explorer'
import { cn } from '~/shared/lib/utils'
import { formatShortAddress } from '~/shared/presenters/format'

type ExplorerLinkKind = 'address' | 'tx'

/**
 * 链上地址 / 交易哈希：打开 BscScan；默认无下划线，hover 显示下划线。
 */
export function ExplorerLink({
  value,
  kind = 'address',
  showIcon = false,
  className,
  shortOptions,
}: {
  value: string
  kind?: ExplorerLinkKind
  /** 稿面「验证」列旁外链小标 */
  showIcon?: boolean
  className?: string
  shortOptions?: { head?: number; tail?: number }
}) {
  const href = kind === 'tx' ? bscscanTx(value) : bscscanAddress(value)
  const label = formatShortAddress(value, shortOptions)

  return (
    <Text
      as="a"
      className={cn(
        'inline-flex items-center gap-1 tabular-nums no-underline hover:underline',
        className,
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      variant="copy"
    >
      {label}
      {showIcon ? (
        <Icon alt="" className="size-2.5 shrink-0" size="sm" src={dappAssets.arrowUpRight} />
      ) : null}
    </Text>
  )
}
