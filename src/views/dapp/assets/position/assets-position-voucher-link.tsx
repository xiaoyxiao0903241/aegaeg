import { formatShortAddress } from '~/shared/api/format-display'
import { Text } from '~/shared/components/text'
import { bscscanAddress } from '~/shared/config/explorer'

/** 仓位卡「凭证」行：短地址链到 BSCScan。 */
export function AssetsPositionVoucherLink({ address, label }: { address: string; label: string }) {
  return (
    <div className="flex items-center justify-start gap-1">
      <Text as="span" className="text-xs text-foreground/40" variant="detail">
        {label}
      </Text>
      <Text
        as="a"
        className="text-xs font-medium text-foreground tabular-nums hover:underline"
        href={bscscanAddress(address)}
        rel="noreferrer"
        target="_blank"
        variant="detail"
      >
        {formatShortAddress(address)}
      </Text>
    </div>
  )
}
